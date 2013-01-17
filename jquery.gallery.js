(function ($) {
	var $container;
	var $thumbnails, $paginationButtons, $pageNext, $pagePrev, $thumbWrap;
	var $mainImg;
	var $skuOptions;
	
	var methods = {
		init: function() {
			$container = this;
			
			$thumbnails = this.find('.thumb');
			$paginationButtons = this.find('.thumbs > button');
			$pageNext = this.find('.thumb-next');
			$pagePrev = this.find('.thumb-prev');
			$thumbWrap = this.find('.thumb-wrap');
			
			$mainImg = this.find('.main-img');
			
			$skuOptions = this.find('.preload-sku-img');
			
			$thumbnails.click(function() { changeThumbnail($(this)); });
			$paginationButtons.click(function() { paginate($(this)); });
			$(window).bind('refresh.sku.color', changeSku);
			
			return this;
		},
		destroy: function() {
			$(window).unbind('refresh.sku.color', changeSku);
		}
	};
	
	var changeSku = function(e, skuID) {
		console.log('changesku');
		if (skuID)
		{
			$mainImg.attr('src', $skuOptions.find('[data-sku-id=' + skuID + ']').attr('src'));
		}
		else //restore previous image
		{
			$mainImg.attr('src', $thumbWrap.find('.selected').attr('src'));
		}
	};
	
	var changeThumbnail = function($this) {
		if ($this.hasClass('selected'))
			return;
		
		$this.addClass('selected').siblings().removeClass('selected');
		
		$mainImg.attr('src', $this.attr('src'));
	};
	
	var STEP_AMOUNT = 321;
	var IMAGES_IN_WINDOW = 7;
	var paginate = function($this) {
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
