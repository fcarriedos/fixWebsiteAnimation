const SLIDES_TO_APPEND = '<div id="animation_container" style="position: absolute; left: 273px; top: -50px">' +
						'<div>' +
							'<img id="headerAnimation_0" src="../i/saas/animations/header/GIF1-1.gif" style="width: 600px">' +
						'</div>' +
						'<div>' +
							'<img id="headerAnimation_1" src="../i/saas/animations/header/whatsapp.gif" style="width: 600px">' +
						'</div>' +
						'<div>' +
							'<img id="headerAnimation_2" src="../i/saas/animations/header/snapchat.gif" style="width: 600px">' +
						'</div>' +
						'<div>' +
							'<img id="headerAnimation_3" src="../i/saas/animations/header/facebook.gif" style="width: 600px">' +
						'</div>' +
						'<div>' +
							'<img id="headerAnimation_4" src="../i/saas/animations/header/linkedin.gif" style="width: 600px">' +
						'</div>' +
						'<div>' +
							'<img id="headerAnimation_5" src="../i/saas/animations/header/pinterest.gif" style="width: 600px">' +
						'</div>' +
						'<div>' +
							'<img id="headerAnimation_6" src="../i/saas/animations/header/telegram.gif" style="width: 600px">' +
						'</div>' +
						'<div>' +
							'<img id="headerAnimation_7" src="../i/saas/animations/header/twitter.gif" style="width: 600px">' +
						'</div>' +
					'</div>';


var currentImageIndex = 0;

var controllerImages = [ 'instagram.png',
						 'whatsapp.png',
						 'snapchat.png',
						 'facebook.png',
						 'linkedin.png',
						 'pinterest.png',
						 'telegram.png',
						 'twitter.png',									 
];

var buyerImages = [ '../i/saas/buyers/instagram.png',
					'../i/saas/buyers/whatsapp.png', 
					'../i/saas/buyers/snapchat.png', 
					'../i/saas/buyers/facebook.png', 
					'../i/saas/buyers/linkedin.png', 
					'../i/saas/buyers/pinterest.png', 
					'../i/saas/buyers/telegram.png', 
					'../i/saas/buyers/twitter.png' 
					];

var animations = [ '../i/saas/animations/header/instagram.gif',
				   '../i/saas/animations/header/whatsapp.gif',
				   '../i/saas/animations/header/snapchat.gif',
				   '../i/saas/animations/header/facebook.gif',
				   '../i/saas/animations/header/linkedin.gif',
				   '../i/saas/animations/header/pinterest.gif',
				   '../i/saas/animations/header/telegram.gif',
				   '../i/saas/animations/header/twitter.gif',
	];



function screenSizeListener() {
	console.log(window.innerWidth);
	switch(true) {

		case ((1920 >= window.innerWidth) && (window.innerWidth > 1200)): 
			// $('#headerContainer').addClass('animation_full_size');
			// restartSlider();
			break;

		case ((1200 >= window.innerWidth) && (window.innerWidth > 1024)):
			// $('#headerContainer').addClass('animation_50_percent');
			// restartSlider();
			break;

		case (window.innerWidth < 900):
			// $('#headerContainer').addClass('animation_50_percent');
			// restartSlider();
			break;

	}
}


function setupSlider() {

	const SLIDER_SETTINGS = {
		// lazyLoad: 'progressive',
		infinite: true,
		autoplay: true,
		autoplaySpeed: 10000,
		arrows: false,
		dots: true,
		useTransforms: true,
		vertical: true,
		lazyLoad: 'ondemand',
	    customPaging: function(slider, i) { 
	        return '<img id="controllerIcon_' + i + '" class="controllerIcon" src="../i/saas/socialnetworks/' + controllerImages[i] + '">';
	    },
	};

	// appendSlides();

	$('#animation_container').on('init', function(event, slick) {
		document.getElementById('controllerIcon_0').style.opacity = '1.00';
	});

	$('#animation_container').slick({
		// lazyLoad: 'progressive',
		infinite: true,
		autoplay: true,
		autoplaySpeed: 10000,
		arrows: false,
		dots: true,
		useTransforms: true,
		vertical: true,
		lazyLoad: 'ondemand',
	    customPaging: function(slider, i) { 
	        return '<img id="controllerIcon_' + i + '" class="controllerIcon" src="../i/saas/socialnetworks/' + controllerImages[i] + '">';
	    },
		responsive: [
		{
			breakpoint: 1200,
			settings: SLIDER_SETTINGS
		},
		{
			breakpoint: 1024,
			settings: SLIDER_SETTINGS
		},
		{
			breakpoint: 900,
			settings: SLIDER_SETTINGS
		}
		]
	});

  	$('#animation_container').on('beforeChange', function(event, slick, currentSlide, nextSlide) {

  		console.log('Slick: ' + slick + ' currentSlide ' + currentSlide + ' nextSlide ' + nextSlide);

	    // Plain swap
	    // document.getElementById('buyer_image').src = buyerImages[(++i % buyerImages.length)];

	    // Stylish swap
	    $('#buyer_image').fadeOut(200, function() {
		    
   			document.getElementById('buyer_image').src = buyerImages[nextSlide];
		 //    setTimeout(() => { $('#buyer_image').fadeIn(200, function() {
		    	
			// });	}, 500);
			$('#buyer_image').fadeIn(500, function() {
		    	
			});
			
		});
	
		// Highlight only the right icon
		document.getElementById('controllerIcon_' + currentSlide).style.opacity = '0.75';
	    document.getElementById('controllerIcon_' + nextSlide).style.opacity = '1.00';
	    console.log('The next slide is ' + nextSlide);
	    // Load the next animation
		document.getElementById('headerAnimation_' + nextSlide).src = animations[nextSlide];			    	

	});

}


function restartSlider() {
	$('#animation_container').slick('unslick');
	removeSlides();
	setTimeout(() => { setupSlider(); }, 2000);
	console.log('removeSlides(): animation restarted!');
}


// function appendSlides() {
// 	var slidesAsDOMObjects = $(SLIDES_TO_APPEND).get(0); // String -> jQuery -> Vanilla Javascript Node
// 	console.log('DOM: ' + slidesAsDOMObjects);
// 	var headerContainer = document.getElementById('headerContainer');
// 	headerContainer.insertBefore(slidesAsDOMObjects, headerContainer.children[2]);
// 	console.log('removeSlides(): slides appended!');
// }


function removeSlides() {
	var headerContainer = document.getElementById('headerContainer');
	var animationContainer = document.getElementById('animation_container');
	headerContainer.removeChild(animationContainer);
	console.log('removeSlides(): slides removed!');
}

