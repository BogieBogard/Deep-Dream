var init = function() {
	
	// content appear
	$('body').css('opacity', 1);
	
	// header 
	$('header').textition({
		map:      {x: 50, y: 20, z: 500},
		speed:    0.8,
		handler:  false,
		autoplay: true,
		interval: 3		
	})
	
	// axis-x
	$('nav a:eq(0)').textition({
		map:     {x: 100, y: 0, z: 0},
		speed:   0.5,		
		handler: 'mouseenter mouseleave'
	})
	
	// axis-z
	$('nav a:eq(1)').textition({
		map:         {x: 0, y: 0, z: 100},
		speed:       0.5,		
		perspective: 50,
		handler:     'mouseenter mouseleave'
	})
	
	// axis-y
	$('nav a:eq(2)').textition({
		map:       {x: 0, y: 40, z: 0},
		speed:     0.5,
		animation: 'ease-out',		
		handler:   'mouseenter mouseleave'
	})		
}

// Run
$(document).ready(init);