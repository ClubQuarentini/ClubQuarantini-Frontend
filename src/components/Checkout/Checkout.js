import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import config from "../../config";
import { useSpring, animated } from "react-spring";
import "./checkout.css";

const CheckoutForm = (props) => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [email, setEmail] = useState("");
  const [tipAmount, setTipAmount] = useState(1);

  const stripe = useStripe();
  const elements = useElements();

  const fade = useSpring({
    config: { duration: 200 },
    from: { opacity: 0, transform: `translate3d(0,200%,0)` },
    to: { opacity: 1, transform: `translate3d(0,0%,0)` },
  });

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    window
      .fetch(`${config.API_URI}/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tipAmount }),
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("data from stipe", data);
        setClientSecret(data.clientSecret);
      });
  }, [tipAmount]);

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };
  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      receipt_email: email,
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: ev.target.name.value,
        },
      },
    });
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };
  return (
    <div className="tip-overlay">
      <animated.div style={fade} className="tip-container">
        <button
          className="exit-btn"
          onClick={() => props.setIsCheckoutFormOpen(!props.isCheckoutFormOpen)}
        >
          X
        </button>
        <h2 id="tip-title">COVID-19 Relief Fund Tip</h2>
        <h3 id="tip-info">
          Any generous tip donated by you will directly<br></br>go towards the
          COVID-19 Relief Fund.
        </h3>
        <h4 id="card-warning">
          Your card is never stored on our server at any point<br></br>during
          checkout and goes directly to Stripe.
        </h4>
        <form id="payment-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address for reciept"
          />
          <input
            type="text"
            value={tipAmount}
            placeholder="4.99"
            onChange={(e) => setTipAmount(e.target.value)}
          />
          <CardElement
            id="card-element"
            options={cardStyle}
            onChange={handleChange}
          />
          <button
            disabled={processing || disabled || succeeded}
            id="submit-payment"
          >
            <span id="button-text">
              {processing ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                "Pay"
              )}
            </span>
          </button>
          {/* Show any error that happens when processing the payment */}
          {error && (
            <div className="card-error" role="alert">
              {error}
            </div>
          )}
          {/* Show a success message upon completion */}
          <p className={succeeded ? "result-message" : "result-message hidden"}>
            Payment successful! Thank you so much for donating.
          </p>
        </form>
      </animated.div>
    </div>
  );
};

export default CheckoutForm;
