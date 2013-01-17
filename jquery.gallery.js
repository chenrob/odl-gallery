(function ($) {
	var STEP_AMOUNT = 321;
	var IMAGES_IN_WINDOW = 7;
	var PREV_PAGE = 1;
	var NEXT_PAGE = -1;
	
	var $container;
	var $thumbnails, $paginationButtons, $pageNext, $pagePrev, $thumbWrap;
	var $mainImgs;
	
	var methods = {
		init: function() {
			$container = this;
			
			$thumbnails = this.find('.thumb');
			$paginationButtons = this.find('.thumbs > button');
			$pageNext = this.find('.thumb-next');
			$pagePrev = this.find('.thumb-prev');
			$thumbWrap = this.find('.thumb-wrap');
			
			$mainImgs = this.find('.main-img');
			
			$thumbnails.click(function() { changeThumbnail($(this)); });
			$paginationButtons.click(function() { paginate($(this)); });
			$(window).bind('refresh.sku.color', changeSku);
			
			return this;
		},
		destroy: function() {
			$(window).unbind('refresh.sku.color', changeSku);
			return this;
		}
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
		changeThumbnail($thumbnails.first());
		
		if (skuID)
			changeImage(skuID);
	};
	
	var changeThumbnail = function($this) {
		if ($this.hasClass('selected'))
			return;
		
		$this.addClass('selected').siblings().removeClass('selected');
		
		changeImage($this);
	};
	
	var paginate = function($this) {
		var mode = $this.hasClass('thumb-prev') ? PREV_PAGE : NEXT_PAGE;
		changePage(mode);
	};
	
	//returns whether we can continue to change page in the mode
	var changePage = function(mode) {
		if (($pageNext.prop('disabled') && mode == NEXT_PAGE)
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
