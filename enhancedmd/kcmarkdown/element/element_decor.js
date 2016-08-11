var cheerio = require('cheerio')

module.exports.create = function create(attrs, callback) {
    var obj = { "kctype": "decor",
                "tagName": "br"};

    //if (attrs['tagName'] != undefined) {
    //    obj["tagName"] = attrs['tagName'];
    //}

    callback.success(obj);
}

module.exports.update = function update(node, attrs, callback) {
    if (attrs['tagName'] != undefined) {
        node["tagName"] = attrs['tagName'];
    }
    callback.success(node);
}

module.exports.render = function render(node, callback) {
    var html = "<" + node['tagName'] + " />"
    $ = cheerio.load(html);
    $(node['tagName']).attr('kctype', 'decor');
    if (node['id']!=undefined) {
        $(node['tagName']).attr('id', node['id']);
    }
    callback.success($.html());
}
