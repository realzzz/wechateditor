/*
 * @Author: Vaninadh
 * @Date:   2016-03-16 14:18:04
 * @Last Modified by:   Vaninadh
 * @Last Modified time: 2016-05-18 10:41:05
 */

define(function(require) {
    var defineComponent = require("flight/lib/component");

    var uiCanvasCommand = require('KCEPROD/command/canvas');
    var uiTextCommand = require('KCEPROD/command/text');
    var uiDroppableCommand = require('KCEPROD/command/droppable');
    var uiSelectCommand = require('KCEPROD/command/select');
    var uiResizeCommand = require('KCEPROD/command/resize');
    //var uiResizeCommand = require('KCEPROD/command/resize_float');
    var uiDraggableCommand = require('KCEPROD/command/draggable');
    var uiSortableCommand = require('KCEPROD/command/sortable');
    var uiDeleteableCommand = require('KCEPROD/command/delete');
    var uiEnTextCommand = require('KCEPROD/command/entext');
    var hotKeyCommand = require('KCEPROD/command/hotkey');
    var uiEditor = require('KCEPROD/ui/edit_panel/ui_editor');
    var uiArticlePanel = require('KCEPROD/ui/edit_panel/ui_article_panel');
    var wxCrawler = require('KCEPROD/ui/header_panel/ui_wxcrawler');
    var errorHandler = require('KCEPROD/command/errorhandler');


    var imageSelect = require('KCEPROD/ui/edit_panel/ui_image_select');
    var notify = require('KCEPROD/ui/edit_panel/ui_notify');

    return defineComponent(editPanel);

    function editPanel() {
        this.attributes({

        });

        this.after('initialize', function() {
            console.log("editPanel is ok!");
            //separate all canvas click by type ,like when element selected the class changed in one js
            //other behavior in other js , all can use click event
            uiDroppableCommand.attachTo(document);
            uiSelectCommand.attachTo(document);
            uiResizeCommand.attachTo(document);
            uiDraggableCommand.attachTo(document);
            uiDeleteableCommand.attachTo(document);
            uiSortableCommand.attachTo(document);

            uiEnTextCommand.attachTo(document);
            uiCanvasCommand.attachTo(document);
            uiTextCommand.attachTo(document);
            hotKeyCommand.attachTo(document);

            uiEditor.attachTo(document);
            uiArticlePanel.attachTo(document);
            wxCrawler.attachTo(document);
            errorHandler.attachTo(document);

            imageSelect.attachTo(document);
            notify.attachTo(document);

            this.trigger(window.kc.ns.e.article.uiArticleListActivate);
            this.trigger(window.kc.ns.e.canvas.uiImageSelectInit);
        });
    }
});
