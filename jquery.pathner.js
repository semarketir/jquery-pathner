/*!
 * jQuery Pathner
 *
 * Requires:
 * - jQuery v2.0.0
 * - jQuery Popup Window v.1.0.1
 */
(function($) {
    var SECONDS_IN_ONE_DAY  = 24*60*60;
    var TOKEN_KEY           = 'tkn';
    var EXPIRE_KEY          = '_exp';
    var EXPIRE_TOKN         = TOKEN_KEY + EXPIRE_KEY;
    var partnerAPI          = 'https://partner.path.com/oauth2/authenticate?response_type=code&client_id=';
    var blankURL            = 'about:blank';
    var stylesCode          = "body{padding:0;margin:0}.pathner{font-family:'HelveticaNeue-Light','Helvetica Neue Light','Helvetica Neue',Helvetica,Arial,'Lucida Grande',sans-serif}.pathner .pathner-reason{margin:4px 0 0;font-size:13px;font-weight:lighter}.pathner .pathner-icon{height:25px}.pathner .pathner-header{padding:8px;background:#e62f17;color:#fff}.pathner .pathner-left{float:left}.pathner .pathner-right{float:right}.pathner .pathner-both{clear:both}.pathner .pathner-content{padding:10px;background:#fff}.pathner .pathner-content .pathner-component{margin-bottom:2px}.pathner .pathner-content .pathner-component textarea{background:#F8F8F8;color:#999;border:.5px solid #DCDCDC;-webkit-border-radius:2px 2px 2px 2px;border-radius:2px 2px 2px 2px;font-size:13px;width:300px;padding:10px;box-shadow:0 0 .5px #DCDCDC;-webkit-box-shadow:0 0 .5px #DCDCDC;-moz-box-shadow:0 0 .5px #DCDCDC}.pathner .pathner-content .pathner-component img{width:100%;-webkit-border-radius:2px 2px 2px 2px;border-radius:2px 2px 2px 2px;box-shadow:0 0 .5px #DCDCDC;-webkit-box-shadow:0 0 .5px #DCDCDC;-moz-box-shadow:0 0 .5px #DCDCDC;min-height:150px}.pathner .pathner-content .pathner-component h3{padding:0;margin:0;-webkit-font-smoothing:antialiased;font-weight:800;text-shadow:0 0 0 rgba(0,0,0,0)}.pathner .pathner-content .pathner-component p{padding:0;margin:0;font-size:14px;-webkit-font-smoothing:antialiased;font-weight:400;text-shadow:0 0 0 rgba(0,0,0,0)}.pathner .pathner-footer{padding:8px 4px;background:#F8F8F8}.pathner .pathner-footer [class^='pathner-button']{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;width:100%;border:0;padding:10px;text-align:center;-webkit-font-smoothing:antialiased;font-weight:400;text-shadow:0 0 0 rgba(0,0,0,0);-webkit-border-radius:4px;border-radius:4px;color:#fff;font-size:14px;cursor:pointer}.pathner .pathner-footer .pathner-button-disabled{opacity:.7}.pathner .pathner-footer .pathner-button-share{background:#e62f17}.pathner .pathner-footer .pathner-button-share:hover,.pathner .pathner-footer .pathner-button-share:active,.pathner .pathner-footer .pathner-button-share:target{background:#e41f11}.pathner .pathner-footer .pathner-button-cancel{background:#eaeaea;color:#666}.pathner .pathner-footer .pathner-button-cancel:hover,.pathner .pathner-footer .pathner-button-cancel:active,.pathner .pathner-footer .pathner-button-cancel:target{background:#e5e5e5;color:#666}.pathner .pathner-appname{text-align:center;color:#cacaca;font-size:small;-webkit-font-smoothing:antialiased;font-weight:400;text-shadow:0 0 0 rgba(0,0,0,0)}";

    var removeStorage = function () {
        try {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(EXPIRE_TOKN);
        } catch (e) {
            console.log('removeStorage: Error removing key ['+ TOKEN_KEY + '] from localStorage: ' + JSON.stringify(e));
            return false;
        }
        return true;
    };

    var getStorage  = function () {
        var now = Date.now();
        var expIn = localStorage.getItem(EXPIRE_TOKN);
        if (expIn===undefined || expIn===null) {
            expIn = 0;
        }
        if (expIn < now) {
            removeStorage();
            return null;
        } else {
            try {
                var value = localStorage.getItem(TOKEN_KEY);
                return value;
            } catch(e) {
                console.log('getStorage: Error reading key ['+ TOKEN_KEY + '] from localStorage: ' + JSON.stringify(e));
                return null;
            }
        }
    };

    var setStorage = function (value, exp) {
        if (exp===undefined || exp===null) {
            exp = SECONDS_IN_ONE_DAY;
        } else {
            exp = Math.abs(exp);
        }

        var now = Date.now();
        var schedule = now + exp * 1000;
        try {
            localStorage.setItem(TOKEN_KEY, value);
            localStorage.setItem(EXPIRE_TOKN, schedule);
        } catch(e) {
            console.log('setStorage: Error setting key ['+ TOKEN_KEY + '] in localStorage: ' + JSON.stringify(e));
            return false;
        }
        return true;
    };

    var buildTpl    = function (selfButton, options) {
        var dataPost;
        var appname = '';
        if (options.appname) {
            appname = 'via ' + options.appname;
        }
        if ($.isFunction(options.data)) {
            dataPost    = options.data(selfButton);
        } else {
            dataPost    = options.data;
        }
        dataPost        = dataPost || {};
        var title       = dataPost.title,
            image       = dataPost.image,
            description = dataPost.description;

        return [
            '<!DOCTYPE html>',
            '<html lang="en">',
            '<head>',
            '<meta name="viewport" content="minimal-ui; initial-scale=1.0; maximum-scale=1.0; user-scalable=no; width=320">',
            '<meta http-equiv="X-UA-Compatible" content="IE=Edge;chrome=1">',
            '<meta charset="utf-8">',
            '<style>', stylesCode, '</style>',
            '</head>',
            '<body>',
            '<div class="pathner">',
            '<div class="pathner-header">',
            '<div class="pathner-left">',
            '<img class="pathner-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAMAAAC7m5rvAAAB4FBMVEX////////////////iEwfiFAjiFQniFwvjGAzjGQ3jGQ7jHBHjHRLjHxTkIBXkIRbkIhfkIxjkJRnkJhrkJhvlJxzlKR7lKyDlLSLlLyTmMifmMijmMynmNCrmNSvmNizmNy3nOzHnPDLnPTPnPzboQDfoQTjoQzroRTzoRjzpST/pSkDpS0HpS0LpTEPqUEfqU0rqVEvqVUzqVk3rWFDrWVHrWlLrW1PrXFTrXVXrX1fsYVnsZFzsZF3sZV7sZ2DtamLta2PtbGTucWrucmvudm/venPvfHXvfXfwgnzwg33whH7whX/whoDwh4HwiYPxiYPxioTxjIbxjojxkIrxkYvyk43ylI7ylZDylpHyl5LymZTzmpXznJfznpnzn5rzoJvzoZz0op70paH0pqL0p6P0qKT0qaX1qqb1q6b1raj1rqn1r6v1sKz2sq72tbH2t7P3u7f3vLn3vrv3wb73wr/4xcL4xsP4x8T4x8X4yMb4ycf5ysj5z8z50M3609D61dP61tT619X62df62tj729n73Nr73tz739374N/74eD74uH85OP85+b86Of86un86+r97Ov97e397+798vH+8/L+9PP+9fT+9vX++Pf++fj++fn//Pz//f3//v7///8K5UXTAAAABHRSTlMAh8LDrEhNWQAAAiVJREFUeAHV1utXTFEYx/GpeRRDaSjkHpJk5MIYEalxz10uUYoml0R0QeMiFaYLQ0y51O9fdWY9e7az9jlnZs95xffVzG/tzzpr7VfbY5TjRTZ5czzJcpFtuclvIfuM73ldMK/HAzf9v2z65e2TdXsDVbsOHmt+OqnHEm3BJWQqv/LscEYWP11M1moG0rNIIdlXG0/D6smxwm5HtpPSdc2BHSLZvG2Ndx73dF4OLTO5Flt2l1KVNo1D9LP3CMme2bAZH4kafsHcaDWJls5aWSOJOqB2jkQXrKyEuHsApt5Go29i36W7RFzRrMpeERcG8NXPdz4oXYC4fpVd570YRp+IeyLZRB4vp1TWwPsZGMUX8J8+yEK87FfZPt5fOLA2XtaprIr3cQfWy4vfgY05sH5eylUWNF3V5/kWFuHlsMrCf+8fX3wWVsPLVZW18J73AcDUQpW9I+6jykaIK5sDpov49wBEM6U8VEJlWEvJFvUA+L2cTw2BG1xP3Gsr6yQj/yiSreJT1Q9GviVi3UESHYeVoYIoMMk/yyhVwWKSbYcdG9vcBNEmsqkCVsalY/XIyMpJbXUHMrMNfDafRFsic9BgK/n0nufNJ8JHL3a9B5eB/ShgthsyHTZB3A5tNnQfwE3i6rTZQ9rY2uoj7oo2e0SmhrXZLZPaCm12w8Ri+qyPZO3QZzhAXEkXsmGIng+tWFPbnviHnjMuX3gu35MuX6/u38pu+gOiwQ99UZw9YwAAAABJRU5ErkJggg==">',
            '</div>',
            '<div class="pathner-right">',
            '<h4 class="pathner-reason">Post to <strong>Path</strong></h4>',
            '</div>',
            '<div class="pathner-both"></div>',
            '</div>',
            '<div class="pathner-content">',
            '<div class="pathner-component">',
            '<textarea name="caption" placeholder="Leave a note..."></textarea>',
            '</div>',
            '<div class="pathner-component">',
            '<h3>' + title + '</h3>',
            '</div>',
            '<div class="pathner-component">',
            '<p>' + description + '</p>',
            '</div>',
            '<div class="pathner-component">',
            '<img src="' + image + '" />',
            '</div>',
            '</div>',
            '<div class="pathner-footer">',
            '<div class="pathner-left">',
            '<p id="loading" class="pathner-reason" style="display: none;margin-left: 10px; margin-top: 10px;">Please wait...</p>',
            '</div>',
            '<div class="pathner-right">',
            '<button class="pathner-button pathner-button-share">Share</button>',
            '</div>',
            '<div class="pathner-right" style="margin-right: 2px;">',
            '<button class="pathner-button pathner-button-cancel" onclick="self.close();">Cancel</button>',
            '</div>',
            '<div class="pathner-both"></div>',
            '</div>',
            '<div class="pathner-appname">',
            '<p>' + appname + '</p>',
            '</div>',
            '</div>',
            '</body>',
            '<html>'
        ].join('');
    };

    var afterWindowPopupShow = function (selfButton, win, pOpts) {
        var resizeTextarea = function (win) {
            var ta = $(win.document.body).find('textarea');
            ta.width(ta.parent().width() - 22)
        };

        var showLoading = function (winBody, status) {
            if (status) {
                $(winBody).find('.pathner-button-share, textarea').attr('disabled', 'disabled').addClass('pathner-button-disabled');
                $(winBody).find('#loading').show();
            } else {
                $(winBody).find('.pathner-button-share, textarea').removeAttr('disabled').removeClass('pathner-button-disabled');
                $(winBody).find('#loading').hide();
            }
        };

        var doRequest = function (winBody, pOpts) {
            showLoading(winBody, true);
            var actionForm  = pOpts.action,
                methodForm  = pOpts.method;

            var dataPost;
            if ($.isFunction(pOpts.data)) {
                dataPost    = pOpts.data(selfButton);
            } else {
                dataPost    = pOpts.data;
            }
            var data = {
                caption: $(winBody).find('textarea').val(),
                title: dataPost.title,
                image: dataPost.image,
                url: dataPost.url,
                description: dataPost.description
            };
            $.ajax({
                type: methodForm,
                url: actionForm,
                data: data,
                beforeSend: function(request){
                    request.setRequestHeader('Authorization', getStorage());
                },
                error: function(xhr, status, err) {
                    if (pOpts.callback && $.isFunction(pOpts.callback.error)) {
                        pOpts.callback.error(xhr, status, err);
                    }
                    showLoading(winBody, false);
                },
                success: function(data) {
                    var done = function () {
                        $(winBody).find('.pathner-button-cancel').trigger('click');
                    };
                    if (pOpts.callback && $.isFunction(pOpts.callback.success)) {
                        pOpts.callback.success(data, done);
                    } else {
                        done();
                    }
                }
            });
        };

        var doRender = function () {
            var winBody = win.document.body;
            $(winBody).html(buildTpl(selfButton, pOpts));
            $(win).resize(function () {
                resizeTextarea(win);
            });
            resizeTextarea(win);
            $(winBody).find('.pathner-button-share').on('click', function () {
                doRequest(winBody, pOpts);
            });
        };

        $(win.document).ready(function () {
            setTimeout(doRender, 100);
        });
    };

    var openWindowPopup = function(selfButton, pOpts, wOpts) {
        afterWindowPopupShow(selfButton, $.popupWindow(blankURL, wOpts), pOpts);
    };

    $.fn.pathPartner = function(pOpts, wOpts) {
        var pOpts = pOpts || {};
        return this.each( function() {
            $(this).on('click', function () {
                var self = this;
                if (getStorage()) {
                    openWindowPopup(self, pOpts, wOpts);
                    return;
                }
                var winAuth = $.popupWindow(partnerAPI + pOpts.clientId, wOpts);
                $(winAuth.document).ready(function(){
                    var checkUrl = setInterval(function () {
                        if (!$.isFunction(winAuth.location.replace)) {
                            return;
                        }
                        try {
                            var currentLocation = winAuth.location.href;
                            if (currentLocation === blankURL) {
                                return;
                            }
                            var data = JSON.parse($(winAuth.document.body).text());
                            if (!data.token) {
                                winAuth.self.close();
                            }
                            clearInterval(checkUrl);
                            setStorage(data.token);
                            winAuth.location.replace(blankURL);
                            afterWindowPopupShow(self, winAuth, pOpts);
                        } catch (Exception) {}
                    }, 1000);
                });
            });
        });
    };
})(jQuery);
