$(function(){
	var showhiden=0;
	$('.research-box1').click(function(event) {
		showhiden++;
		if (showhiden%2==1) {
			$('.main-nav-uls').css('display', 'none');
			$(".search-hiden").css('display', 'block');
			$(".search-hiden").animate({'width':'+=420px'}, 400);
		}else{
			$('.main-nav-uls').css('display', 'block');
			$(".search-hiden").animate({'width':'0px'}, 400);
			$(".search-hiden").css('display', 'none');
		}
	});
	$('.selects-more-ul').children('li').click(function(event) {
		$('.select-hiden>p').html($('.selects-more-ul').children('li').eq($(this).index()).html());
		$('.selects-more').css('display', 'none');
	});
	$('.sb_select').mouseenter(function(event) {
		$('.selects-more').css('display', 'block');
	});
	$('.sb_select').mouseleave(function(event) {
		$('.selects-more').css('display', 'none');
	});
	$('.main-nav-uls').children('li').click(function(event) {
		$(this).css('background-color', '#23222a');
		$(this).siblings('li').css('background-color', '#090810');
	});
	$('.main-nav-uls').children('li').mouseenter(function(event) {
		$(this).children('.small-triangle').addClass('now-click-hnav');
		$(this).siblings('li').children('.small-triangle').removeClass('now-click-hnav');		
		$('.hide-nav-main-box').eq($(this).index()).addClass('now-click-hnav');
		$('.hide-nav-main-box').eq($(this).index()).siblings('.hide-nav-main-box').removeClass('now-click-hnav');
		
	});
	var scrolla=0;
	scrolla=$('.l-main-chose').offset().top-$('.l-main-chose').height();
	$(window).scroll(function(event) {
		if ($(this).scrollTop()>scrolla) {
			$('.l-scolltop').show('fast', function() {
				
			});
			$('.l-main-nav-box-fixed').css('display', 'block');
		}else{
			$('.l-scolltop').hide('fast', function() {
				
			});
			$('.l-main-nav-box-fixed').css('display', 'none');
			// console.log(1);
		}
		$('.l-scolltop').click(function(event) {
			$('html,body').stop().animate({
				'scrollTop': '0px',
			},1000);
		});
	});
})