
define(function(require) {
    var namespace = {
        // keys
        k:{
            // error event data object keys:
            "error_operation":"eop",
            "error_result_code":"ecode",
            "error_message":"emsg",

            // current global variable keys
            "current_article_id":"cur_aid",
            "current_user_id":"cur_uid",

            // input related
            "text_ignore_input":"txtigip",
            "text_current_selection_start":"txtcursels",
            "text_current_selection_end":"txtcursele",
            "text_current_selection_style":"txtcurselstl",

            // selector related
            "containerBtnSelector":"#containerBtn"
        },

        // events
        e:{
            // application events
            "applicationInitialized":"appinited",

            // error event:
            "generalError":"gerr",

            // article event :
            "createArticle":"cArt",
            "updateArticle":"uArt",
            "pruneArticle":"pArt",
            "deleteArticle":"dArt",
            "renderArticle":"rArt",
            "getArticleInfo":"gArtInfo",
            "updateAricleUserInfo":"updArtUsrInfo",
            "goFocusOnLastEmptyTextOnCanvas":"gFOLstEtyTCvs",
            "targetArticleChanged":"tartchgd",

            "articlelistCreateNewArtile":"alcrtna",

            "articleUndoOp":"atludp",
            "articleRedoOp":"atlrdp",

            // node event:
            "createNode":"cNd",
            "updateNode":"uNd",
            "deleteNode":"dNd",
            "renderNode":"rNd",
            "cloneNode":"clnNd",
            "insertInlineblock":"nstlneblk",

            "event_text_changed":"etxtchgd",
            "event_node_changed":"endchgd",
            "event_canvas_copied":"ecvscpd",

            // text event:
            "textCopyStyle":"etxtcpst",
            "textStyleCopided":"etxtstlcpd",
            "textCopyStyleClear":"etxtcpstclr",

            "textinsertsymbol":"etxtistsyb",

            //
            "fetch_thirdparty_link":"efth3ptlnk",
            "canvas_clear_selection":"ecvsclrsel",
            "querySelectionContainer":"qscn",
            "pastContainerQueryAnswer":"pcqa",

            data:{
                dataArticleList:"dAtL",
                dataArticleEdit:"dAtE",
                dataArticleDelete:"dAtD",
                dataTemplateList:"dTlpL",
                dataOthersList:"dOthersL",
                dataTemplateCollect:"dTlpCol",
                dataTemplateCollectList:"dTlpColL",
                dataTemplateCollectDelete:"dTlpColD",
                dataInlineblockCollectList:"dIlbColL",
                dataInlineblockCollectDelete:"dIlbColD",
                dataPicList:"dPicL",
                dataPicDelete:"dPicD",
                dataPicAdd:"dPicA"
            },
            tab:{
                uiTabsPanelCenter:"uTabspc",
                uiTabTemp:"uTabT",
                uiTabCollect:"uTabC",
                uiTabLibrary:"uTabL",
                uiTabOthers:"uiTabO",

                uiTemplateList:"uiTlpL",
                uiTemplateCollectEffect:"uiTlpCE",
                uiOthersList:"uiOthersL",
                uiCollectTabProduce:"uiColtTabP",
                uiCollectTabLove:"uiColtTabL",
                uiTemplateCollectList:"uiTlpColL",
                uiTemplateCollectDelete:"uiTlpColD",
                uiTemplateCollectRefresh:"uiTlpColR",
                uiInlineblockCollectList:"uiIlbColL",
                uiInlineblockCollectDelete:"uiIlbColD",
                uiInlineblockCollectRefresh:"uiIlbColR",
                uiPicList:"uiPicL",
                uiPicDelete:"uiPicD",
                uiPicRefresh:"uiPicR"
            },
            command:{
                uiDroppableEnable:"uCodDrpEab",
                uiDroppableDisable:"uCodDrpDis",
                uiDroppableDestroy:"uCodDrpDes",
                uiDroppableActivate:"uCodDrpAct",
                uiDraggableActivate:"uCodDrgAct",
                uiDraggableDestroy:"uCodDrgDes",
                uiResizeActivate:"uCodRsAct",
                uiResizeDestroy:"uCodRsDes",
                uiDeleteableActivate:"uCodDltAct",
                uiDeleteableExecute:"uCodDltExt",
                uiSortableActivate:"uCodSotAct"
            },
            resp:{
                canvas_create_article:"ccrtart",
                canvas_render_article:"creart",
                resize_node_update:"rsndupt",
                get_article_info:'rsgarinfo'
            },
            property:{
                uiPropertyCenterDispatch:"uProCenterD",
                uiPropertyPanelHide:"uProPH",
                uiPropertyContainerActivate:"uProCAct",
                uiPropertyTextActivate:"uProTAct",
                uiPropertyImageActivate:"uProIAct"
            },
            article:{
                uiArticleListActivate:"uAtLA",
                uiArticleDelete:"uAtD",
                uiArticleEdit:"uAtE",
                uiArticlePrune:"uAtPrn",
                uiArticleList:"uAtL",
                uiAritclePrivew:"uAtPrv"
            },
            canvas:{
                imgSelect:{
                    uiTabImageSelectUrl:"uTISUl",
                    uiTabImageSelectUpload:"uTISUd",
                    uiTabImageSelectLibrary:"uTISUL",
                    uiCanvasPicRefresh:"uCvPR",
                    uiImageSelectPicList:"uImgSPL"
                },
                uiRenderCanvas:"uRCa",
                uiImageSelectActivate:"uImgSA",
                uiImageSelectInit:"uImgSI",
                uiImageSelectClose:"uImgSC",
                uiNotifyOp:"uNyOp",
                uiNotifyConfirm:"uNyCf",
                uiNotifyInfoConfirm:"uNyIfCf",
                uiSkinChange:"uSkCge"
            }
        },

        // constants
        c:{
            canvasClass:".canvas",
            rootContainer:" [kctype=\"container\"]",
            img:{
                url:"http://img1.kcyouli.com/",
                api_type:"imageView2",
                suf:"/",
                mode:"0",
                pic_list_img:{
                    w:400,
                    h:400
                }
            }
        }

    };

    // initialize the window global var & namespace
    window.kc = {};
    window.kc.ns = namespace;
    window.kc['cur_uid']=1;

    return namespace;
})
