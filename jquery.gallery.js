(function ($) {
	var $container;
	var $thumbnails, $paginationButtons, $pageNext, $pagePrev, $thumbWrap;
	var $mainImg;
	
	var methods = {
		init: function() {
			$container = this;
			
			$thumbnails = this.find('.thumb');
			$paginationButtons = this.find('.thumbs > button');
			$pageNext = this.find('.thumb-next');
			$pagePrev = this.find('.thumb-prev');
			$thumbWrap = this.find('.thumb-wrap');
			
			$mainImg = this.find('.main-img');
			
			$thumbnails.click(function() { thumbnailOnClick($(this)); });
			$paginationButtons.click(function() { paginationButtonOnClick($(this)); });
		}
	};
	
	var thumbnailOnClick = function($this) {
		if ($this.hasClass('selected'))
			return;
		
		$this.addClass('selected').siblings().removeClass('selected');
		
		$mainImg.attr('src', $this.attr('src'));
	};
	
	var STEP_AMOUNT = 321;
	var IMAGES_IN_WINDOW = 7;
	var paginationButtonOnClick = function($this) {
		var mode = $this.hasClass('thumb-prev') ? 1 : -1;
		
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
		
		$pageNext.prop('disabled', ((page + 1) * IMAGES_IN_WINDOW >= $thumbnails.length));
		$pagePrev.prop('disabled', (page == 0));
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
