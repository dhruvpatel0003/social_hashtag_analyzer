import React from 'react'

const Payment = (props) => {

  const handleOnSubscribeNow = () => {
    fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "X-CSRFToken" 
      },
      body: JSON.stringify({
        userID : '1234'
      }),
    }).then((response) => {
      console.log("Successfully completed the payment",response.id);
    });
  }

  return (
    <React.Fragment>
      <div>
      Your selected plan : 
      {props.subscriptionAmount}
      <button onClick={handleOnSubscribeNow}>Subscribe Now!</button>
      </div>
    </React.Fragment>
  )
}
export default Payment;
