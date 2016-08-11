/*
* @Author: Vaninadh
* @Date:   2016-03-29 11:59:56
* @Last Modified by:   Vaninadh
* @Last Modified time: 2016-04-25 11:05:40
*/

define(function(require) {
    var defineComponent = require("flight/lib/component");
    var ns = window.kc.ns;
    var util = require("KCEPROD/util/util");

    return defineComponent(uiHeader);

    function uiHeader() {
        this.attributes({
            loginBtn: '#loginBtn',
            loginDialog: '',
            loginPopupClose: "#loginPopupClose",
            sendSmsBtn: '#sendsms',
            dologin: '#dologin',
            phoneInput: '#phoneInput',
            smsInput: '#smsInput',
            previousSendPhone: '',
            videoDialog: '',
            videoPopupClose: "#videoclose"
        });

        this.updateUser = function(){
            //
            var currentUser = AV.User.current();
            if (currentUser) {
              // do stuff with the user
              //console.log(currentUser.get('username'));
              var username = currentUser.get('username');
              if (username.length > 4) {
                   var lastFour = username.substr(username.length - 4);
                   username = "****" + lastFour;
              }
              $(this.attr.loginBtn).text(username);
              util.setGlobalVar(window.kc.ns.k.current_user_id, currentUser.id);
              // TODO -- add ip check here, if ip is changed then logout and login again

            }
        }

        this.checkLogin = function(){
            //
            var currentUser = AV.User.current();
            // this.showLoginDialog();
            // return;

            if (currentUser) {
              // do stuff with the user
              //console.log(currentUser.get('username'));
              var username = currentUser.get('username');
              if (username.length > 4) {
                   var lastFour = username.substr(username.length - 4);
                   username = "****" + lastFour;
              }
              $(this.attr.loginBtn).text(username);
              util.setGlobalVar(window.kc.ns.k.current_user_id, currentUser.id);
            } else {
              // show the signup or login page
              this.showLoginDialog();
            }
        }

        this.sendSms = function(){
            var thisRef = this;
            var phone = $(this.attr.phoneInput)[0].value;
            if (util.isEmptyStr(phone) || !util.verifyPhoneNumber(phone)) {
                var errData = {};
                errData[ns.k.error_result_code] = 1;
                errData[ns.k.error_operation] = "send sms";
                errData[ns.k.error_message] = " invalide phone number";
                this.trigger(document, ns.e.generalError, errData);

                thisRef.trigger(window.kc.ns.e.canvas.uiNotifyOp,{
                    text:'无效的电话号码!',
                    type:'error'
                });

                return;
            }
            else {
                $(thisRef.attr.sendSmsBtn).off('click');
                //$(thisRef.attr.sendSmsBtn).attr('disabled','disabled');
                $(thisRef.attr.sendSmsBtn).removeClass('colorYellow');
                $(thisRef.attr.sendSmsBtn).addClass('colorGray');

                thisRef.attr.previousSendPhone = phone;

                AV.Cloud.requestSmsCode(phone).then(function() {
                    thisRef.attr.previousSendPhone = phone;

                    thisRef.trigger(window.kc.ns.e.canvas.uiNotifyOp,{
                        text:'已发送短信!'
                    });
                    //
                }, function(err) {
                    var errData = {};
                    errData[ns.k.error_result_code] = 1;
                    errData[ns.k.error_operation] = "send sms";
                    errData[ns.k.error_message] = " fail to send sms";
                    thisRef.trigger(document, ns.e.generalError, errData);

                    thisRef.trigger(window.kc.ns.e.canvas.uiNotifyOp,{
                        text:'短信发送失败'  + err.message,
                        type:'error'
                    });

                    $(thisRef.attr.sendSmsBtn).on('click');
                    $(thisRef.attr.sendSmsBtn).removeClass('colorGray');
                    $(thisRef.attr.sendSmsBtn).addClass('colorYellow');

                    return;
                });

            }
        }

        this.doLogin = function(){

            if (util.isEmptyStr(this.attr.previousSendPhone)){
                this.attr.previousSendPhone =  $(this.attr.phoneInput)[0].value;
            }
            if (util.isEmptyStr(this.attr.previousSendPhone) || !util.verifyPhoneNumber(this.attr.previousSendPhone)) {
                var errData = {};
                errData[ns.k.error_result_code] = 1;
                errData[ns.k.error_operation] = "login";
                errData[ns.k.error_message] = " no phone number or haven't send sms";
                this.trigger(document, ns.e.generalError, errData);

                this.trigger(window.kc.ns.e.canvas.uiNotifyOp,{
                    text:'请输入电话号码',
                    type:'error'
                });
                return;
            }

            var code = $(this.attr.smsInput)[0].value;
            if (util.isEmptyStr(code)) {
                var errData = {};
                errData[ns.k.error_result_code] = 1;
                errData[ns.k.error_operation] = "login";
                errData[ns.k.error_message] = " empty sms verify code";
                this.trigger(document, ns.e.generalError, errData);

                this.trigger(window.kc.ns.e.canvas.uiNotifyOp,{
                    text:'请输入短信验证码',
                    type:'error'
                });

                return;
            }

            var user = new AV.User();
            var thisRef = this;
            user.signUpOrlogInWithMobilePhone({
                mobilePhoneNumber: this.attr.previousSendPhone,
                smsCode: code,
            }).then(function(user) {
                $(thisRef.attr.loginBtn).html(user.username);
                util.setGlobalVar(window.kc.ns.k.current_user_id, user.id);
                var username = user.get('username');
                if (username.length > 4) {
                     var lastFour = username.substr(username.length - 4);
                     username = "****" + lastFour;
                }
                $(thisRef.attr.loginBtn).text(username);
                thisRef.closeLoginDialog();
                return;
            }, function(error) {
                var errData = {};
                errData[ns.k.error_result_code] = 1;
                errData[ns.k.error_operation] = "login";
                errData[ns.k.error_message] = error.message;
                thisRef.trigger(document, ns.e.generalError, errData);

                thisRef.trigger(window.kc.ns.e.canvas.uiNotifyOp,{
                    text:'失败 ' + error.message,
                    type:'error'
                });
                return;
            });
        }

        this.showLoginDialog = function() {
            util.displayGrayBg();
            this.attr.loginDialog.dialog("open");
        }

        this.closeLoginDialog= function () {
            this.attr.loginDialog.dialog("close");
            util.hideGrayBg();
        }

        this.showVideoDialog = function() {
            util.displayGrayBg();
            $('#videodiv').show();
            $('#vtag')[0].load();
            $('#vtag')[0].play();
        }

        this.closeVideoDialog= function () {
            $('#vtag')[0].pause();
            $('#videodiv').hide();
            util.hideGrayBg();
        }

        this.getDialog = function() {
            return [
                '<div id="loginPanel">',
            //    '<input id="phoneInput" type="text" placeholder="输入手机号">',
            //    '<button id="sendsms" >发送验证码</button>',
            //    '<input id="smsInput" type="text" placeholder="输入验证码">',
            //    '<button id="dologin" type="text">登陆</button>',

                '<div class="popContent8 pd30 "> \
                    <img id="loginPopupClose" src="images/p3_7.png" class="popClose" /> \
            		<div class="font16 colorBlack pb20">短信验证码一键登陆</div> \
            		<div class="clearfix pb20"> \
            			<div class="floatL font0 border4 pd6"> \
        				<img src="images/p3_4.jpg" width="20" class="displayI verMiddle mr5" />\
        				<div class="displayI verMiddle font14 colorGray mr5">手机号</div>\
        				    <input id="phoneInput" class="displayI bgWhite1 verMiddle input1 pd5 width4 font14 colorBlack" type="text" />\
        			    </div>\
    			        <div class="floatL width5 border4 pd10 ml5 textC"><a id="sendsms" class="displayI colorYellow font14 ">发送验证码</a></div>\
    		       </div>\
        		<div class="clearfix">\
        			<div class="floatL font0 border4 pd6">\
        				<img src="images/p3_5.jpg" width="20" class="displayI verMiddle mr5" />\
        				<div class="displayI verMiddle font14 colorGray mr5">验证码</div>\
        				<input id="smsInput" class="displayI bgWhite1 verMiddle input1 pd5 width4 font14 colorBlack" type="text" />\
        			</div>\
        			<!--div class="floatL width5 border4 pd10 ml5 textC"><a class="displayI colorYellow font14">重新获取</a></div-->\
        		</div>\
        		<!--div class="pt15 pl10">\
        			<span class="displayI verMiddle checkboxIcon1 checkboxSelected"></span>\
        			<span class="displayI verMiddle font14 colorBlack">下次自动登录</span>\
        		</div-->\
    		    <div class="textC mt30"><a id="dologin" class="displayI bgBlue4 font20 colorWhite btn1 pt5 pb5">短信登录</a></div>\
    	        </div>',

                '</div>'


            ].join('\n');
        }

        this.after('initialize', function() {
        	console.log("uiHeader is ok!");

            $('body').append(this.getDialog());

            this.attr.loginDialog = $("#loginPanel").dialog({
                closeOnEscape:false,
                create: function(event) {
                    $(event.target).dialog("widget").css({ "position": "fixed" });
                },
                resizable: false,
                height: 'auto',
                width: 455,
                //height: '100%',
                //width: '100%',
                show: "fade",
                hide: "fade",
                modal: true,
                title: '登陆',
                position: { my: "top", at: "top", of: window },
                dialogClass: '',
                autoOpen: false,
                buttons: {
                }
            });



            this.on(this.attr.loginBtn, "click", this.checkLogin);
            this.on(this.attr.sendSmsBtn, "click", this.sendSms);
            this.on(this.attr.dologin, "click", this.doLogin);
            this.on(this.attr.loginPopupClose, "click", this.closeLoginDialog)
            this.on('#videobtn', "click", this.showVideoDialog);
            this.on('#videoclose', "click", this.closeVideoDialog);

            this.on(document, window.kc.ns.e.applicationInitialized, this.updateUser);

            if( $('.cd-stretchy-nav').length > 0 ) {
                var stretchyNavs = $('.cd-stretchy-nav');

                stretchyNavs.each(function(){
                    var stretchyNav = $(this),
                        stretchyNavTrigger = stretchyNav.find('.cd-nav-trigger');

                    stretchyNavTrigger.on('click', function(event){
                        event.preventDefault();
                        stretchyNav.toggleClass('nav-is-visible');
                    });
                });

                $(document).on('click', function(event){
                    ( !$(event.target).is('.cd-nav-trigger') && !$(event.target).is('.cd-nav-trigger span') ) && stretchyNavs.removeClass('nav-is-visible');
                });
            }



        });
    }
})
