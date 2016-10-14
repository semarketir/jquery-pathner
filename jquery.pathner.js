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
    var stylesCode          = "body{padding:0;margin:0}.pathner{font-family:'HelveticaNeue-Light','Helvetica Neue Light','Helvetica Neue',Helvetica,Arial,'Lucida Grande',sans-serif;margin:0;padding:0;margin-bottom:10px}.pathner-body{background:#fff}.pathner-header{background:#e4322e;color:#fff;padding:8px}.pathner-header > img{height:25px;width:25px;margin-left:2px}.pathner-header > span{font-weight:500;font-size:small;position:absolute;top:13px;left:40px;clear:both;-webkit-font-smoothing:antialiased}.pathner-input-area{padding:10px}.pathner-input-area > textarea{background:#f0f0f0;color:#333;margin:0;padding:8px;border:1px solid #C8C8C8;resize:none;width:100%;height:50px;font-weight:200;font-size:small}.pathner-preview-box{padding:10px;padding-top:0}.pathner-preview-box-media{padding:0;margin:0}.pathner-preview-box-media > img{width:100%;padding:0;margin:0;border:0}.pathner-preview-box-caption{border:1px solid #C8C8C8;padding:10px;margin:0;margin-top:-5px}.pathner-preview-box-caption > h4{padding:0;margin:0;margin-bottom:4px;font-weight:700;color:#333;-webkit-font-smoothing:antialiased}.pathner-preview-box-caption > p{padding:0;margin:0;margin-bottom:4px;font-weight:200;font-size:small;text-align:justify;color:#494949;-webkit-font-smoothing:antialiased}.pathner-share-area{padding:10px;padding-top:0}.pathner-share-area > button{background:#61b23d;color:#f2f8f0;margin-top:0;width:100%;border:0;padding:15px;font-weight:400;font-size:14px;-webkit-border-radius:2px 2px 2px 2px;border-radius:2px 2px 2px 2px;-webkit-font-smoothing:antialiased;cursor:pointer}.pathner-share-area > button:active,.pathner-share-area > button:target{background:#448229}.pathner-footer{padding:10px;text-align:center}.pathner-footer > p{color:#afafaf;font-size:small;padding:0;margin:0;-webkit-font-smoothing:antialiased}";
    var readyButton         = "Share to <strong>Path</strong>";
    var loadingButton       = "Saving...";

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
            appname = options.appname;
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

        return '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
            '<title>Post to Path</title>' +
            '<meta content="minimal-ui; initial-scale=1.0; maximum-scale=1.0; user-scalable=no; width=320" name="viewport">' +
            '<meta content="IE=Edge;chrome=1" http-equiv="X-UA-Compatible">' +
            '<meta charset="utf-8">' +
            '<style>' + stylesCode + '</style>' +
            '</head>' +
            '<body>' +
            '<div class="pathner">' +
            '<div class="pathner-header">' +
            '<img class="pathner-icon" src= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAMAAAC7m5rvAAAB4FBMVEX////////////////iEwfiFAjiFQniFwvjGAzjGQ3jGQ7jHBHjHRLjHxTkIBXkIRbkIhfkIxjkJRnkJhrkJhvlJxzlKR7lKyDlLSLlLyTmMifmMijmMynmNCrmNSvmNizmNy3nOzHnPDLnPTPnPzboQDfoQTjoQzroRTzoRjzpST/pSkDpS0HpS0LpTEPqUEfqU0rqVEvqVUzqVk3rWFDrWVHrWlLrW1PrXFTrXVXrX1fsYVnsZFzsZF3sZV7sZ2DtamLta2PtbGTucWrucmvudm/venPvfHXvfXfwgnzwg33whH7whX/whoDwh4HwiYPxiYPxioTxjIbxjojxkIrxkYvyk43ylI7ylZDylpHyl5LymZTzmpXznJfznpnzn5rzoJvzoZz0op70paH0pqL0p6P0qKT0qaX1qqb1q6b1raj1rqn1r6v1sKz2sq72tbH2t7P3u7f3vLn3vrv3wb73wr/4xcL4xsP4x8T4x8X4yMb4ycf5ysj5z8z50M3609D61dP61tT619X62df62tj729n73Nr73tz739374N/74eD74uH85OP85+b86Of86un86+r97Ov97e397+798vH+8/L+9PP+9fT+9vX++Pf++fj++fn//Pz//f3//v7///8K5UXTAAAABHRSTlMAh8LDrEhNWQAAAiVJREFUeAHV1utXTFEYx/GpeRRDaSjkHpJk5MIYEalxz10uUYoml0R0QeMiFaYLQ0y51O9fdWY9e7az9jlnZs95xffVzG/tzzpr7VfbY5TjRTZ5czzJcpFtuclvIfuM73ldMK/HAzf9v2z65e2TdXsDVbsOHmt+OqnHEm3BJWQqv/LscEYWP11M1moG0rNIIdlXG0/D6smxwm5HtpPSdc2BHSLZvG2Ndx73dF4OLTO5Flt2l1KVNo1D9LP3CMme2bAZH4kafsHcaDWJls5aWSOJOqB2jkQXrKyEuHsApt5Go29i36W7RFzRrMpeERcG8NXPdz4oXYC4fpVd570YRp+IeyLZRB4vp1TWwPsZGMUX8J8+yEK87FfZPt5fOLA2XtaprIr3cQfWy4vfgY05sH5eylUWNF3V5/kWFuHlsMrCf+8fX3wWVsPLVZW18J73AcDUQpW9I+6jykaIK5sDpov49wBEM6U8VEJlWEvJFvUA+L2cTw2BG1xP3Gsr6yQj/yiSreJT1Q9GviVi3UESHYeVoYIoMMk/yyhVwWKSbYcdG9vcBNEmsqkCVsalY/XIyMpJbXUHMrMNfDafRFsic9BgK/n0nufNJ8JHL3a9B5eB/ShgthsyHTZB3A5tNnQfwE3i6rTZQ9rY2uoj7oo2e0SmhrXZLZPaCm12w8Ri+qyPZO3QZzhAXEkXsmGIng+tWFPbnviHnjMuX3gu35MuX6/u38pu+gOiwQ99UZw9YwAAAABJRU5ErkJggg==" />' +
            '<span>Post to <strong>Path</strong></span>' +
            '</div>' +
            '<div class="pathner-body">' +
            '<div class="pathner-input-area">' +
            '<textarea placeholder="Leave a note..."></textarea>' +
            '</div>' +
            '<div class="pathner-preview-box">' +
            '<div class="pathner-preview-box-media">' +
            '<img src="' + image + '" />' +
            '</div>' +
            '<div class="pathner-preview-box-caption">' +
            '<h4>' + title + '</h4>' +
            '<p>' + description + '</p>' +
            '</div>' +
            '</div>' +
            '<div class="pathner-share-area">' +
            '<button id="pathner-share-area-share">' + readyButton + '</button>' +
            '<button id="pathner-share-area-cancel" onclick="self.close();" style="display: none;">Cancel</button>'+
            '</div>' +
            '</div>' +
            '<div class="pathner-footer">' +
            '<p>' + appname + '</p>' +
            '</div>' +
            '</div>' +
            '</body>' +
            '</html>';
    };

    var afterWindowPopupShow = function (selfButton, win, pOpts) {
        var resizeTextarea = function (win) {
            var ta = $(win.document.body).find('textarea');
            ta.width(ta.parent().width() - 18)
        };

        var showLoading = function (winBody, status) {
            if (status) {
                $(winBody).find('#pathner-share-area-share, textarea').attr('disabled', 'disabled');
                $(winBody).find('#pathner-share-area-share').html(loadingButton);
            } else {
                $(winBody).find('#pathner-share-area-share, textarea').removeAttr('disabled');
                $(winBody).find('#pathner-share-area-share').html(readyButton);
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
                        $(winBody).find('#pathner-share-area-cancel').trigger('click');
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
            var resizeInterval = setInterval(function () {
                resizeTextarea(win);
                clearInterval(resizeInterval);
            }, 2000);
            resizeTextarea(win);
            $(winBody).find('#pathner-share-area-share').on('click', function () {
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
