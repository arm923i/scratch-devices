$('.scrollup').click(function(){
	$("html, body").animate({ scrollTop: 0}, 600);
		return false;
});


var $page = $('html, body');
$('a[href*="#"]').click(function() {
    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top-56
    }, 600);
    return false;
});