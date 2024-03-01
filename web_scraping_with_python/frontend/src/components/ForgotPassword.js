import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOnSendMail = () => {
    // console.log("document :::: ",document.cookie);
    fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "X-CSRFToken" 
      },
      body: JSON.stringify({
        email: email,
      }),
    }).then((response) => {
      setMessage(`URL for setting new password is sent to the ${email}`);
      console.log(
        "Getting the response inside sendmail functionality : ",
        response
      );
    });
  };

  return (
    <React.Fragment>
      {message && <p>{message}</p>}
      {!message && (
        <div>
          <h2>Forgot Password</h2>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
          />
          <button onClick={handleOnSendMail}>Send Email</button>
        </div>
      )}
    </React.Fragment>
  );
};

export default ForgotPassword;
