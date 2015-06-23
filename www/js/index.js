document.addEventListener('deviceready', ready, false);
var currentusername;
if(!window.localStorage.getItem('lang')){
	var curentlanguage = 'nl';
} else {
	var curentlanguage = window.localStorage.getItem('lang');
}
var aan;


var isOffline = 'onLine' in navigator && !navigator.onLine;

function ready(){
	cordova.plugins.backgroundMode.enable();
	var bgGeo = window.plugins.backgroundGeoLocation;
	
	$('#submit').click(function(){
        $.post('http://dts.test.uwkm.nl/api.php', { username: $('#username').val(), password: $('#password').val(), mode: 'login' }).done(function(data){
            data = JSON.parse(data);
            if(data.status=='sucess'){
               $('#loginfieldset').hide();
               
               currentusername = $('#username').val();
               $('#mybutton').addClass(data.devicestatus+'_'+curentlanguage);
                console.log(data.devicestatus);
               $('#buttonfieldset').show();
            } else {
                //alert(data.status);
            }
        });
    });
    $('#mybutton').click(function(){
        var button = $(this);
        console.log('click');
        navigator.geolocation.getCurrentPosition(
            function(position){
                var lat =position.coords.latitude;
                var long = position.coords.longitude;
                if($(button).attr('class') == 'aan_'+curentlanguage){
                    $(button).removeClass('aan_'+curentlanguage).addClass('uit_'+curentlanguage);
                    aan = 0;
                } else {
                    $(button).removeClass('uit_'+curentlanguage).addClass('aan_'+curentlanguage);
                    aan = 1;
                }

                $.post('http://dts.test.uwkm.nl/api.php',  { username: currentusername, isactive: aan, positie: lat+','+long, mode: 'setactive' }).done(function( data ) {
                   // alert( "Data Loaded: " + data );
                });
        },
        function(error){
            alert(JSON.stringify(error));console.log(JSON.stringify(error)); 
        }, {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true}
        );
    });

    $('#rsubmit').click(function(){
        $.post('http://dts.test.uwkm.nl/api.php',{ username: $('#rusername').val(), email: $('#remail').val(), phone: $('#rphone').val(), password: $('#rpassword').val(), mode: 'register' }).done(function(data){
            if(data=='sucess'){
            	if(curentlanguage == 'nl'){
                	alert('Je registratie verzoek is verzonden');
                } else {
                	alert('Your application has been submitted');
                }
            } else {
                //alert(data);
            }
        });
    });
    $('.language option').filter(function() { return $(this).text() == curentlanguage; }).prop('selected', true);
    
    $('.language').change(function(){
    	if($(this).val() == 'eng'){
    		$('.language option').filter(function() { return $(this).text() == curentlanguage; }).prop('selected', true);
    		curentlanguage = 'eng';
    		window.localStorage.setItem('lang', curentlanguage);
    		$('a[href="#register"]').text('Register');
    		$('a[href="#login"]').text('Login');
    		$('#submit').text('Login');
    		$('#rsubmit').text('Register');
    		$('#hlogin').text('DTS App - Login');
    		$('#hregister').text('DTS App - Register');
    		
    		$('label[for="confirmpassword"]').text('Confirm Password:');
    		$('label[for="password"]').text('Password:');
    		$('label[for="phone"]').text('Phonenumber:');
    		$('label[for="email"]').text('Email:');
    		$('label[for="username"]').text('Username:');
    		if(aan){
    			$('#mybutton').removeClass('aan_nl').addClass('aan_eng');
    		} else {
    			$('#mybutton').removeClass('uit_nl').addClass('uit_eng');
    		}
    	} else {
    		curentlanguage ='nl';
    		window.localStorage.setItem('lang', curentlanguage);
    		$('.language option').filter(function() { return $(this).text() == curentlanguage; }).prop('selected', true);
    		$('a[href="#register"]').text('Registreer');
    		$('a[href="#login"]').text('Inloggen');
    		$('#submit').text('Inloggen');
    		$('#rsubmit').text('Registreer');
    		$('#hlogin').text('DTS App - Inloggen');
    		$('#hregister').text('DTS App - Registreer');
    		
    		$('label[for="confirmpassword"]').text('Bevestig Wachtwoord:');
    		$('label[for="password"]').text('Wachtwoord:');
    		$('label[for="phone"]').text('Telefoonnummer:');
    		$('label[for="email"]').text('E-mail:');
    		$('label[for="username"]').text('Gebruikersnaam:');
    		
    		if(aan){
    			$('#mybutton').removeClass('aan_eng').addClass('aan_nl');
    		} else {
    			$('#mybutton').removeClass('uit_eng').addClass('uit_nl');
    		}
    	}
    });

	
	
    cordova.plugins.backgroundMode.onactivate = function () {
        window.setInterval(function () {
            // Modify the currently displayed notification
            if(aan && !isOffline){
            	/*navigator.geolocation.getCurrentPosition(
            		function(position){	
                		var lat =position.coords.latitude;
                		var long = position.coords.longitude;
            			$.post('http://dts.test.uwkm.nl/api.php',  { username: currentusername, positie: lat+','+long, mode: 'updatelocation' }).done(function( data ) {
                   		 console.log( "Data Loaded: " + data );
                		});	
                	},
        			function(error){
            		alert(JSON.stringify(error));console.log(JSON.stringify(error)); 
        			}, {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true}); */
        		bgGeo.start();
        	}
        }, 150000);
    }
    window.setInterval(function () {
        // Modify the currently displayed notification
        if(aan && !cordova.plugins.backgroundMode.isActive() && !isOffline){
            navigator.geolocation.getCurrentPosition(
            	function(position){	
                	var lat =position.coords.latitude;
                	var long = position.coords.longitude;
            		$.post('http://dts.test.uwkm.nl/api.php',  { username: currentusername, positie: lat+','+long, mode: 'updatelocation' }).done(function( data ) {
                   		 console.log( "Data Loaded: " + data );
                	});	
                },
        		function(error){
            		alert(JSON.stringify(error));console.log(JSON.stringify(error)); 
        		}, {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true});
        	}
    }, 150000);
    
	
    
    bgGeo.configure(function(location) {
        	console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
        	$.post('http://dts.test.uwkm.nl/api.php',  { username: currentusername, positie: location.latitude+','+location.longitude, mode: 'updatelocation' }).done(function( data ) {
            	console.log( "Data Loaded: " + data );
        	});	
        	bgGeo.finish();
    	}, function(error) {
        	console.log('BackgroundGeoLocation error');
    	}, {
       
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,

        activityType: 'AutomotiveNavigation',
        debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: true // <-- enable this to clear background location settings when the app terminates
    }); 
}