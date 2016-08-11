
// IMPORTANT NOTE - this shall always be the first js to be initialized

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var util = require("../util/util");
    return defineComponent(boot);

    function boot() {
        this.attributes({

        });

        this.after('initialize', function() {
        	console.log("boot is ok!");

            // A better but complex way is use server side solution
            AV.initialize('lckey', 'lcsecret');

            // any way update user info first
            var currentUser = AV.User.current();
            if (currentUser) {
                // do stuff with the user
                util.setGlobalVar(window.kc.ns.k.current_user_id, currentUser.id);
            }
        });
    }
});
