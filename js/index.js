$(function(){
	$('.l-chose-left-uls').children('li').click(function(event) {
	$('.l-chose-left-uls').children('li').eq($(this).index()).addClass('l-clicked');
	$('.l-chose-left-uls').children('li').eq($(this).index()).siblings('li').removeClass('l-clicked');
	});
	$('.l-chose-rignt-le').mouseenter(function(event) {
		$('.icon-xiala-').stop().hide('fast', function() {
			
		});
		$('.icon-caozuo-shangla').stop().show('fast', function() {
			
		});
		$('.l-selects-more').css('display', 'block');
	});
	$('.l-chose-rignt-le').mouseleave(function(event) {
		$('.icon-xiala-').stop().show('fast', function() {
			
		});
		$('.icon-caozuo-shangla').stop().hide('fast', function() {
			
		});
		$('.l-selects-more').css('display', 'none');
	});
	$('.l-selects-more-ul').children('li').click(function(event) {
		$('.l-selects>p').html($('.l-selects-more-ul').children('li').eq($(this).index()).html());
		$('.l-selects-more').css('display', 'none');
		$('.icon-xiala-').stop().show('fast', function() {
			
		});
		$('.icon-caozuo-shangla').stop().hide('fast', function() {
			
		});
	});
	var l_timer;
	var l_num=0;
	var l_po=0;
	function l_slide(){
		timer=setInterval(function(){
			l_num++;
			l_po++;
			if(l_num>4){
				l_num=0;
				$('.l-slide-ul').css({
					'margin-left': -760*l_num+'px',
				});
				l_num=1;
			}
			$('.l-slide-ul').animate({'margin-left':-760*l_num+'px'}
				,500);
			if (l_po>3) {
				l_po=0;
			}
			$('.l-slide-ol>li').eq(l_po).siblings('li').removeClass('l-slied-now');
			$('.l-slide-ol>li').eq(l_po).addClass('l-slied-now')
			
		},4000)
	}
	l_slide();
	$('.l-slide-ul').mouseenter(function(event) {
		clearInterval(timer);
	});
	$('.l-slide-ul').mouseleave(function(event) {
		l_slide();
	});
	function l_slide_move(){
		$('.l-slide-ol>li').mouseenter(function(event) {
			l_num=$(this).index();
			l_po=$(this).index();
			$('.l-slide-ul').stop().animate({'margin-left':-760*l_num+'px'}
				,500);
			$('.l-slide-ol>li').eq(l_po).siblings('li').removeClass('l-slied-now');
			$('.l-slide-ol>li').eq(l_po).addClass('l-slied-now')

		});
	}
	l_slide_move();
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
