// NOTE EACH ELEMENT REQUIRES TO HAVE FOLLOWING things
// all supported attributes
// 1 - create
// 2 - update
// 3 - render
// define of callback has two functions success(obj) or error(err)


// THIS ELEMENT IS JUST A EXAMPLE... no other usage at all & shall not be invoked anywhere

module.exports.create = function create(attrs, callback) {
    console.log(" example create is not impled");
    var fakeObj = { "kctype": "text" };
    console.log(fakeObj);
    callback.success(fakeObj);
}

module.exports.update = function update(node, attrs, callback) {
    console.log(" example update is not impled");
    node["attr"] = "1";
    callback.success(node);
}

module.exports.render = function render(node, callback) {
    console.log(" example render is not impled");
    callback.success("<div>test</div>");

}
