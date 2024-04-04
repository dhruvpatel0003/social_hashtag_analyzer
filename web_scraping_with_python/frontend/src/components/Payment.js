import React from 'react'

const Payment = (props) => {

  return (
    <React.Fragment>
      <div>
      Your selected plan : 
      {props.subscriptionAmount}
      </div>
    </React.Fragment>
  )
}
export default Payment;
