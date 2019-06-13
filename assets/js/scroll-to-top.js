$('.scrollup').click(function(){
	$("html, body").animate({ scrollTop: "300px" });
		return false;
});


var $page = $('html, body');
$('a[href*="#"]').click(function() {
    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 400);
    return false;
});