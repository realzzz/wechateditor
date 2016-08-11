var cheerio = require('cheerio')

var construtSelectorByPath = module.exports.construtSelectorByPath = function construtSelectorByPath(path) {
    if (path.length == 0) {
        return "";
    }
    var arrOfPath = path.split("#");
    var selectorPath = "";
    for (var i = 0; i < arrOfPath.length; i++) {
        var levelpath = arrOfPath[i];
        var arraOfLevelPath = levelpath.split(".");
        selectorPath = selectorPath + "[kctype=\"" + arraOfLevelPath[0] + "\"]";
        if (arraOfLevelPath.length == 2) {
            selectorPath = selectorPath + "[id=\"" + arraOfLevelPath[1] + "\"] ";
        }
        if (i + 1 != arrOfPath.length) {
            selectorPath = selectorPath + "> "
        }
    }
    return selectorPath;
}

var attachAttrToHtml = module.exports.attachAttrToHtml = function attachAttrToHtml(htmlContent, path, value) {
    var selectorPath = construtSelectorByPath(path);
    $ = cheerio.load(htmlContent);
    // ideally we don't need this judge...
    if ($(selectorPath).length > 0) {
        // check out if this is value or attributes
        var valueArray = value.split("#");
        if (valueArray.length == 1) {
            //
            $(selectorPath).first().text(valueArray[0]);
        } else if (valueArray.length == 2) {
            $(selectorPath).first().attr(valueArray[0], valueArray[0]);
        }
    }
    return $.html();
}

var appendObjectToHtml = module.exports.appendObjectToHtml = function appendObjectToHtml(htmlContent, path, objhtml) {
    var selectorPath = construtSelectorByPath(path);
    var htmlObj = cheerio.load(htmlContent);
    // ideally we don't need this judge...
    if (htmlObj(selectorPath).length > 0) {
        // check out if this is value or attributes
        htmlObj(selectorPath).first().append(objhtml);
    }
    return htmlObj.html();
}
