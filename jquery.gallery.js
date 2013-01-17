(function ($) {
	var STEP_AMOUNT = 321;
	var IMAGES_IN_WINDOW = 7;
	var PREV_PAGE = 1;
	var NEXT_PAGE = -1;
	var RIGHT_KEY = 39;
	var LEFT_KEY = 37;
	
	//sometimes, mag img is not available -- this allows us to detect the "not available" image
	//that is served with dimensions smaller than what we're expecting
	var MIN_MAG_IMG_WIDTH = 900;
	
	var $container;
	var $thumbnails, $paginationButtons, $pageNext, $pagePrev, $thumbWrap;
	var $mainImgs;
	var $magImg;
	
	var methods = {
		init: function() {
			$container = this;
			
			$thumbnails = this.find('.thumb');
			$paginationButtons = this.find('.thumbs > button');
			$pageNext = this.find('.thumb-next');
			$pagePrev = this.find('.thumb-prev');
			$thumbWrap = this.find('.thumb-wrap');
			
			$mainImgs = this.find('.main-img');
			
			$magImg = this.find('.mag-img');
			if ($magImg.length)
			{
				$magImg.imagesLoaded({
					done: function($images) {
						if ($magImg.width() > MIN_MAG_IMG_WIDTH)
						{
							$wrap = $('<a></a>')
								.attr('href', $magImg.attr('src'))
								.attr('src', $mainImgs.first().attr('src'))
								.addClass('mag-wrap');
							$mainImgs.first().wrap($wrap);	

							//since we wrapped the first image, need to reset the $mainImgs var
							$mainImgs = $container.find('.main-image').children();
							window.robert = $mainImgs;
							
							$container.find('.mag-wrap').loupe({width: 300, height: 300, loupe: 'loupe gallery'});
						}
					}
				});
			}
			
			$thumbnails.click(function() { changeThumbnail($(this)); });
			$paginationButtons.click(function() { paginate($(this)); });
			
			if ($thumbnails.length)
			{
				$(window).bind('refresh.sku.color', changeSku);
				$(document).bind('keydown', keydown);
			}
			return this;
		},
		destroy: function() {
			$(window).unbind('refresh.sku.color', changeSku);
			$(document).unbind('keydown');
			return this;
		}
	};
	
	var keydown = function(e) {
		var $current = $thumbnails.filter('.selected');
		var $target = null;
		if (event.which == RIGHT_KEY)
			$target = $current.next();
		else if (event.which == LEFT_KEY)
			$target = $current.prev();
		
		if ($target && $target.length)
			changeThumbnail($target);
	};
	
	var changeImage = function(arg) {
		var filter = '[data-sku-id="' + arg + '"]';
		
		if (typeof arg === 'object')
			filter = '[src="' + arg.attr('src') + '"]';
		
		$mainImgs.filter(filter).removeClass('hide').siblings().addClass('hide');
	};
	
	var changeSku = function(e, skuID) {
		//change to first page
		var cond;
		do { cond = changePage(PREV_PAGE); } while(cond);

		//always force first image first
		//but only do it if there is a valid skuID
		if (skuID)
		{
			changeThumbnail($thumbnails.first());
			changeImage(skuID);
		}
	};
	
	var changeThumbnail = function($this) {
		$this.addClass('selected').siblings().removeClass('selected');
		
		changeImage($this);
	};
	
	var paginate = function($this) {
		var mode = $this.hasClass('thumb-prev') ? PREV_PAGE : NEXT_PAGE;
		changePage(mode);
	};
	
	//returns whether we can continue to change page in the mode
	var changePage = function(mode) {
		if (!$paginationButtons.length
		 || ($pageNext.prop('disabled') && mode == NEXT_PAGE)
		 || ($pagePrev.prop('disabled') && mode == PREV_PAGE))
			return false;
		
		//shift positioning of .thumb-wrap
		//need to manually adjust positioning instead of doing jQuery's blah.css('top', '+=321')
		//since jQ occasionally screws up and we end up with WTF floating point positions
		//and nothing lines up anymore
		var step = mode * STEP_AMOUNT;
		var pos = $thumbWrap.data('top') || 0;
		pos += step;
		$thumbWrap.data('top', pos).css('top', pos + 'px');
		
		//enable/disable buttons
		var page = $thumbWrap.data('page') || 0;
		page -= mode;
		$thumbWrap.data('page', page);
		
		var disableNextPage = ((page + 1) * IMAGES_IN_WINDOW >= $thumbnails.length);
		var disablePrevPage = (page == 0);
		
		$pageNext.prop('disabled', disableNextPage);
		$pagePrev.prop('disabled', disablePrevPage);
		
		return mode == PREV_PAGE ? !disablePrevPage : !disableNextPage;
	};
	
	$.fn.gallery = function(method) {
		if (methods[method])
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		else if (typeof method === 'object' || !method)
			return methods.init.apply(this, arguments);
		else
			$.error('Method ' +  method + ' does not exist on jQuery.fn.gallery');
	};
})(jQuery);
