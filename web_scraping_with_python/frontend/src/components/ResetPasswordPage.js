import React from "react";
import { useState } from "react";
import { useNavigate }  from "react-router-dom"
;
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleOnResetPassword = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const domainRegex = /@gmail\.com$/;
    if (!emailRegex.test(email) || !domainRegex.test(email)) {
      setErrorMessage("Please enter a valid Gmail address");
      return;
    }

    const passwordRegex = /^(?=.*[@#])(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Password must contain the @ or # symbol, numbers, and be at least 8 characters long"
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: hashedPassword,
      }),
    };

    try {
      const response = await fetch("/api/reset-password", requestOptions);
      console.log("getting the response ",response);
      if (response.ok) {
        response.text().then(message => {
          setErrorMessage(message);
          console.log("Getting the response inside reset password functionality: ", message);
          navigate("/login");
        });
      } else {
        console.error("Error:", response.statusText);
        setErrorMessage(response.statusText)
      }
    } catch (error) {
      console.error("Error sending forgot password request:", error);
      setErrorMessage(error);
    }
  };

  const handleOnLogin = () => {
    navigate("/login");
  }



  return (
    <div>
      <div>
      <button onClick={handleOnLogin}>Login</button>
      </div>
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
      <button onClick={handleOnResetPassword}>Reset Password</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default ResetPasswordPage;
