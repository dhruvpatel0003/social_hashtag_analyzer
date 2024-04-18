import React from "react";

const Payment = (props) => {
  const handleOnSubscribeNow = () => {
    fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "X-CSRFToken"
      },
      body: JSON.stringify({
        subscription_amount : props.subscriptionAmount,
        subscription_duration : props.subscriptionDuration
      }),
    })
      .then((response) =>  response.json())
      .then((data) => {
        window.location.href = data.redirect_url;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <React.Fragment>
      <div>
        Your selected plan :{props.subscriptionAmount}
        <button onClick={handleOnSubscribeNow}>Subscribe Now!</button>
      </div>
    </React.Fragment>
  );
};
export default Payment;
