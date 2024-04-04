import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Payment from './Payment';
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [subscriptionStatus, setSubscriptionStatus] = useState(false);

  const [paymentValue, setPaymentValue] = useState(0);


  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [subscriptionExpiresDate, setSubscriptionExpiresDate] = useState("");
  const [subscriptionDate,setSubScriptionDate] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const domainRegex = /@gmail\.com$/;
    if (!emailRegex.test(email) || !domainRegex.test(email)) {
      setErrorMessage("Please enter a valid Gmail address");
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[@#])(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must contain the @ or # symbol, numbers, and be at least 8 characters long"
      );
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("subscriptionPlan ::::::: ", subscriptionPlan);

    const subscriptionStatus = [{
      "subscription_amount": subscriptionPlan,
      "subscription_date" : subscriptionDate,
      "subscription_expires_date" : subscriptionExpiresDate,
    }]


    const requestOptions = {
      method: "POST",   
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password: hashedPassword,
        phone_number: phoneNumber,
        subscription_status : subscriptionStatus
      }),
    };

    try {
      const response = await fetch("/api/create-user", requestOptions);
      const data = await response.json();
      if(data.phone_number){
        setErrorMessage(data.phone_number[0]);
      }
      if(data.email){
        setErrorMessage(data.email[0]);
      }
    //   console.log("daata ::::::: ", data.phone_number);
      if (data && response.status === 201) {
        // console.log(response.status);
        const userId = data.user_id;
        document.cookie = `user_id=${userId}`;
        console.log("document coookiee ::::::: ", document.cookie);
        navigate("/login");
      }
    } catch (error) {
      setErrorMessage(error);
      console.error("Error creating user:", error);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleOnSubscriptionPlan = (amount, duration) => {

    setPaymentValue(amount);

    setSubscriptionPlan(amount);
    const currentDate = new Date();
    setSubScriptionDate(currentDate.toISOString().split("T")[0]);
    const endDate = new Date(currentDate);
    if (duration === "month") {
      endDate.setMonth(endDate.getMonth() + 1);
    }else{
        endDate.setFullYear(endDate.getFullYear() + 1);
        console.log("endDate ::::::: ", endDate.toISOString().split("T")[0], amount);
    }
    // console.log("endDate ::::::: ", endDate.toISOString().split("T")[0], amount);
    setSubscriptionExpiresDate(endDate.toISOString().split("T")[0]);
    // console.log("subscriptionPlan ::::::: "+subscriptionPlan);
    // console.log("subscriptionDuration ::::::: " + subscriptionDuration);
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password (must contain @ or # symbol, numbers, at least 8 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <div>
        <label>
          Subscription Plan:
          {/* <input
                    type="checkbox"
                    checked={subscriptionStatus}
                    onChange={(e) => setSubscriptionStatus(e.target.checked)}
                /> */}
        </label>
        <button onClick={() => handleOnSubscriptionPlan("78", "month")}>
          $78/month
        </button>
        <button onClick={() => handleOnSubscriptionPlan("936", "year")}>
          $936/year
        </button>
      </div>
      {paymentValue && <Payment subscriptionAmount={paymentValue}/>}
      <button onClick={handleSubmit}>Sign Up</button>
      <button onClick={handleLogin}>Login</button>

      {errorMessage && <p>{errorMessage}</p>}
      {/* {password.length < 4 && (
        <p>Password must be at least 8 characters long</p>
      )} */}
    </div>
  );
};

export default SignUpPage;
