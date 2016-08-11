define(function(require) {
    var defineComponent = require("flight/lib/component");
    var util = require("../util/util");
    return defineComponent(application);

    function application() {
        this.attributes({
            mainBox:'.mainBox'
        });

        this.mainBoxClicked = function(e, data){
            var eventtarget = event.target;
            var eventtoelement = event.toElement;

            if (eventtarget.className !== undefined
                && eventtarget.className.indexOf('mainBox') > -1) {
                    this.trigger(window.kc.ns.e.canvas_clear_selection);
            }
        }

        this.after('initialize', function() {
        	console.log("application is ok!");

            // finally let's trigger the initialize complete event
            this.trigger(window.kc.ns.e.applicationInitialized, {});

            this.on(this.attr.mainBox, "click", this.mainBoxClicked);

            //
            //AV.User.logOut();
            var currentUser = AV.User.current();
            if (!currentUser) {
                this.trigger(window.kc.ns.e.articlelistCreateNewArtile, {});
            }
        });
    }
});
