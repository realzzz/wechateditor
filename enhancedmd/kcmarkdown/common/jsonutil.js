
module.exports={
    // IMPORTANT - it ONLY compares the first level and only support string & number
    simpleCompareJsonObject: function compareJsonObject(objA, objB){
        var aKeys = Object.keys(objA);
        var bKeys = Object.keys(objB);

        if (aKeys.length != bKeys.length)
            return false;

        for (var i=0; i<aKeys.length; i++){
            var tmpKey = aKeys[i];
            if(objA[tmpKey] === objB[tmpKey]){
                continue;
            }
            else{
                return false;
            }
        }
        return true;
    }
}