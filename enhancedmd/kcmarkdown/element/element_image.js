// NOTE EACH ELEMENT REQUIRES TO HAVE FOLLOWING things
// all supported attributes
// 1 - create
// 2 - update
// 3 - render
// define of callback has two functions success(obj) or error(err)
var cheerio = require('cheerio')
var cssGenerator = require('../common/cssGenerator');

module.exports.create = function create(attrs, callback) {
    var imgObj = { "kctype": "image" };
    var keysOfAttr = Object.keys(attrs);
    for (var i = 0; i < keysOfAttr.length; i++) {
        var attr = keysOfAttr[i];
        imgObj[attr.trim()] = attrs[attr];
    }
    callback.success(imgObj);
}

// well looks like most of the element has the same process here... but for now let's keep them seperated. will see how it goes later.
module.exports.update = function update(node, attrs, callback) {
    var keysOfAttr = Object.keys(attrs);
    for (var i = 0; i < keysOfAttr.length; i++) {
        var attr = keysOfAttr[i];

        if (attr != 'style') {
            node[attr.trim()] = attrs[attr];
        }
        else {
            var targetstyle = node[attr];
            if (targetstyle == undefined) {
                targetstyle = {};
                node[attr] = targetstyle;
            }
            var updatestyle = attrs[attr];
            var keysOfStyleAttr = Object.keys(updatestyle);
            for (var j = 0; j < keysOfStyleAttr.length; j++) {
                var tmpkey = keysOfStyleAttr[j];
                if (updatestyle[tmpkey] === "") {
                    // this meas clear styles for this range
                    delete targetstyle[tmpkey];
                } else {
                    targetstyle[tmpkey.trim()] = updatestyle[tmpkey];
                }
            }
        }

    }
    callback.success(node);
}

module.exports.render = function render(node, callback) {
    if (node == undefined){
        var err = new Error("empty node to render");
        callback.error(err);
    }

    var outbound = cheerio.load("<section kctype='image'></section>")
    if(node["id"] != undefined){
        outbound('section').attr('id', node["id"]);
    }
    if(node["style"] != undefined){
        var styleStr = cssGenerator.build(node);
        if (node['align'] == 'center') {
            styleStr += "margin: 0 auto;"
        }
        outbound('section').attr('style', styleStr);
    }

    var img = cheerio.load("<img class='kc-dashed'>");

    if(node["src"] != undefined){
        img('img').attr('src', node["src"]);
    }
    // this is quite tricky here ... hopefully work as expected
    // after all we just want img to fill in parent section as much as possible, nothing else ;-)
    var initialtype = true;
    if (node['style'] != undefined) {
        var stylestr = ""
        if (node['style']['width'] != undefined) {
            var  nwidth = node['style']['width'];
            if (nwidth.indexOf("%")>-1) {
                stylestr += " width: " + nwidth +";";
            }
            else if (nwidth.indexOf("px")>-1){
                stylestr += " width: 100%; ";
            }
            else {
                stylestr += ("width:" + nwidth + ";");
            }

            initialtype = false;
        }
        if (node['style']['height'] != undefined) {
            var  nheight = node['style']['height'];
            if (nheight.indexOf("%")>-1) {
                stylestr += " height: " + nheight+";";
            }
            else if (nheight.indexOf("px")>-1){
                stylestr += " height: 100%; ";
            }
            else {
                stylestr += ("height:" + nheight +";");
            }

            initialtype = false;
        }

        if (node['style']['max-width'] != undefined) {
            stylestr += (" max-width: " +  node['style']['max-width'])
        }
        if (node['style']['max-height'] != undefined) {
            stylestr += (" max-height: " +  node['style']['max-height'])
        }

        if (node['style']['border'] != undefined) {
            stylestr += " border: " + node['style']['border'] + ";";
        }

        if (node['style']['border-radius'] != undefined) {
            stylestr += " border-radius: " + node['style']['border-radius'] +";";
        }

        if (node['align'] == 'center') {
            stylestr += "display:block;margin: 0 auto;"
        }

        if (stylestr != "") {
            stylestr = "box-sizing: border-box; " + stylestr;
            img('img').attr('style', stylestr);
        }

    }

    outbound('section').append(img.html());

    // todo - more attributes
    callback.success(outbound.html());
}
