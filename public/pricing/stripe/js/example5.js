(function() {
  "use strict";

  var elements = stripe.elements({
    // Stripe's examples are localized to specific languages, but if
    // you wish to have Elements automatically detect your user's locale,
    // use `locale: 'auto'` instead.
    locale: window.__exampleLocale,
  });

  /**
   * Card Element
   */
  var card = elements.create("card", {
    iconStyle: "solid",
    style: {
      base: {
        iconColor: "#6978DE",
        color: "#6978DE",
        fontWeight: 400,
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        fontSize: "16px",
        fontSmoothing: "antialiased",

        "::placeholder": {
          color: "#ABB0D1"
        },
        ":-webkit-autofill": {
          color: "#ABB0D1"
        }
      },
      invalid: {
        iconColor: "#ff6217",
        color: "#ff6217"
      }
    }
  });
  card.mount("#example5-card");

  function adjustPhoneInputStyles() {
    var wrappedPhoneInputs = document.getElementsByClassName('iti iti--allow-dropdown iti--separate-dial-code');
        for (var wrappedPhoneInput of wrappedPhoneInputs) {
            wrappedPhoneInput.style.width = '100%';
            wrappedPhoneInput.style.zIndex = '101';
            document.getElementById('subscriberPhone').style.paddingLeft = '55px';
        }
  }

  /**
   * Payment Request Element
  
  var paymentRequest = stripe.paymentRequest({
    country: "US",
    currency: "usd",
    total: {
      amount: 2900,
      label: "Total"
    },
    requestPayerName: true,
    requestPayerEmail: true,
    requestPayerPhone: true
  });
  paymentRequest.on("token", function(result) {
    var example = document.querySelector(".example5");
    // example.querySelector(".token").innerText = result.token.id;
    // Roll CC form
    // Unroll configure account form
    $('#creditCardAccountCreationFields').slideUp();
    $('#paymentRequestAccountCreationFields').slideDown();
    initializeTelInputField('paymentRequestSubscriberPhone');
    // Adjust phone input styles
    // example.classList.add("submitted");
    result.complete("success");
  });

  var paymentRequestElement = elements.create("paymentRequestButton", {
    paymentRequest: paymentRequest,
    style: {
      paymentRequestButton: {
        theme: "light"
      }
    }
  });

  paymentRequest.canMakePayment().then(function(result) {
    if (result) {
      document.querySelector(".example5 .card-only").style.display = "none";
      document.querySelector(
        ".example5 .payment-request-available"
      ).style.display =
        "block";
      paymentRequestElement.mount("#example5-paymentRequest");
    }
  });

  */

  registerElements([card], "example5");
})();
