$('.scrollup').click(function(){
	$("html, body").animate({ scrollTop: 0}, 600);
		return false;
});


var $page = $('html, body');
$('a[href*="#"]:not([href="#]):not([href="#myCarousel"])').click(function() {
    $page.animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 400);
    return false;
});