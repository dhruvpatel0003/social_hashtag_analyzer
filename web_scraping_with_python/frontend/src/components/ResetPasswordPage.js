import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Rectangle } from "recharts";
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tokenExpired, setTokenExpired] = useState(false);

  useEffect(() => {
    const checkTokenExpiration = async () => {
      try {
        const response = await fetch(`/api/check-token-expiration/${token}`);
        console.log("response ", response.status);
        console.log(document.cookie);

        if (response.ok) {
          console.log("after checking expiries");
          // Token is valid, no action needed
        } else {
          console.log("Token was expires");
          setTokenExpired(true);
        }
      } catch (error) {
        console.error("Error checking token expiration:", error);
      }
    };
    checkTokenExpiration();
  }, []);

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

    console.log("request Options ", requestOptions.body);
    try {
      const response = await fetch(
        `/api/reset-password/${token}`,
        requestOptions
      );
      console.log("getting the response ", response);
      if (response.ok) {
        response.text().then((message) => {
          setErrorMessage(message);
          console.log(
            "Getting the response inside reset password functionality: ",
            message
          );
          navigate("/login");
        });
      } else {
        console.error("Error:", response.statusText);
        setErrorMessage(response.statusText);
      }
    } catch (error) {
      console.error("Error sending forgot password request:", error);
      setErrorMessage(error);
    }
  };

  const handleOnLogin = () => {
    navigate("/login");
  };

  const handleOnForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <React.Fragment>
      {!tokenExpired && (
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
      )}
      {tokenExpired && (
        <div>
          <p>Link was expired. Please try again</p>
          <button onClick={handleOnForgotPassword}>
            Go to Forgot Password
          </button>
        </div>
      )}
    </React.Fragment>
  );
};

export default ResetPasswordPage;
