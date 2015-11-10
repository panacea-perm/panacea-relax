$(function() {
    $("#more-info-btn").click(function() {
        $('html, body').animate({
            scrollTop: $("#about").offset().top
        }, 1000);
    });

});
