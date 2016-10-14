$(document).ready(function () {
    var resizeTextarea = function () {
        var textarea = $('.pathner-input-area > textarea');
        var parentWidth = textarea.parent().width();
        textarea.width(parentWidth - 18);
    };
    resizeTextarea();
    $(window).resize(function () {
        resizeTextarea()
    });
});
