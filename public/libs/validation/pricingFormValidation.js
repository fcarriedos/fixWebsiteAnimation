'use strict';

const form = document.getElementById('paypalForm');

var phoneInstance = null;
var phoneInput = null;
var phoneInstanceUtils = null;
const request = window.superagent;


function showErrorAlert(title, message) {
	Swal.fire({
	  title: title,
	  text: message,
	  type: 'error',
	  confirmButtonText: 'Ok'
	});
}


function triggerBrowserValidation() {
	// The only way to trigger HTML5 form validation UI is to fake a user submit
	// event.
	var submit = document.createElement('input');
	submit.type = 'submit';
	submit.style.display = 'none';
	form.appendChild(submit);
	submit.click();
	submit.remove();
	console.log('triggerBrowserValidation(): Triggered fake validation!!!');
}


function formIsFilled() {
	// Trigger HTML5 validation UI on the form if any of the inputs fail
    // validation.
    var plainInputsValid = true;
    Array.prototype.forEach.call(form.querySelectorAll('input'), function(input) {
      if (input.checkValidity && !input.checkValidity()) {
        plainInputsValid = false;
        return false;
      }
    });
    
    if (!plainInputsValid) {
      triggerBrowserValidation();
      console.log('Hay campos invalidos');
      return false;
    }
    return plainInputsValid;
}


function isEmailValid(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


function fieldsAreValid() {

	var subscriberName = document.getElementById('subscriberName').value;
	var subscriberEmail = document.getElementById('subscriberEmail').value;

	var validName = (subscriberName && (subscriberName.length > 0));
	var validEmail = isEmailValid(subscriberEmail);

	if (!validName) {
		showErrorAlert('Invalid name', 'Name cannot be empty!');
		return false;
	}

	if (!validEmail) {
		showErrorAlert('Invalid email', 'Email has to be like xxxx@yyyy.zzz!');
		return false;
	}

	if (!phoneInstance.isValidNumber()) {
		showErrorAlert('Invalid phone', 'Please double check your phone, perhaps missing trailing 0 or wrong country?');
		return false;
	}

    if (!passwordStrongEnough) {
        return false;
    }

	return true;

}


// Listen on the form's 'submit' handler...
function formIsValid() {

	if(!formIsFilled() || !fieldsAreValid()) {
		return false;
	}

    console.log('formIsValid(): all the fields are valid!');
    return true;

    // // Show a loading screen...
    // example.classList.add('submitting');

    // // Disable all inputs.
    // disableInputs();

    // // Gather additional customer data we may have collected in our form.
    // var name = form.querySelector('#' + exampleName + '-name');
    // var address1 = form.querySelector('#' + exampleName + '-address');
    // var city = form.querySelector('#' + exampleName + '-city');
    // var state = form.querySelector('#' + exampleName + '-state');
    // var zip = form.querySelector('#' + exampleName + '-zip');
    // var additionalData = {
    //   name: name ? name.value : undefined,
    //   address_line1: address1 ? address1.value : undefined,
    //   address_city: city ? city.value : undefined,
    //   address_state: state ? state.value : undefined,
    //   address_zip: zip ? zip.value : undefined,
    // };

};


function initializeTelInputField() {
    phoneInput = document.getElementById('subscriberPhone');
    phoneInstance = window.intlTelInput(phoneInput, {
        separateDialCode: true,
        initialCountry: "auto",
        geoIpLookup: function(callback) {
            request.get('https://b2cb1b00.ngrok.io/beta/customer/location?customerIp=188.76.20.47' /*+ customerIp*/)
            .then((successResponse) => {
                console.log('initializeTelInputField(): located client as in country ' + JSON.stringify(successResponse.body));
                callback(successResponse.body.countryCode);
            })
            .catch((errorResponse) => {
                console.log('initializeTelInputField(): could not locate client because of ' + errorResponse);
            });
        },
        preferredCountries: [ "us", "ca", "gb" ],
        utilsScript: 'https://d2tzi4yayp7s6t.cloudfront.net/beta/static/shippingForm/js/intlTelInput-utils.js'
    });
    phoneInstanceUtils = window.intlTelInputGlobals.loadUtils("https://d2tzi4yayp7s6t.cloudfront.net/beta/static/shippingForm/js/intlTelInput-utils.js");

	phoneInstance.promise.then(() => { 

		var wrappedPhoneInput = document.getElementsByClassName('iti iti--allow-dropdown iti--separate-dial-code')[0];
		wrappedPhoneInput.style.width = '100%';
		wrappedPhoneInput.style.zIndex = '101';
		document.getElementById('subscriberPhone').style.paddingLeft = '55px';

	});

    // var theSpan = document.createElement('span');
    // theSpan.setAttribute('class', 'focus-input100');
    // theSpan.setAttribute('style', 'top: 9px');
    // var theWrapperDiv = document.getElementsByClassName('intl-tel-input')[0];
    // theWrapperDiv.appendChild(theSpan);
}


