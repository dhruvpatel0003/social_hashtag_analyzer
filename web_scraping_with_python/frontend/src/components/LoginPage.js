import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("login");
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);
  const [sumAnswer, setSumAnswer] = useState("");

  useEffect(() => {
    setNumber1(Math.floor(Math.random() * 10));
    setNumber2(Math.floor(Math.random() * 10));
  }, []);

  const handleSumChange = (e) => {
    setSumAnswer(e.target.value);
  };

  const handleOnRefreshNumbers = () => {
    const randomNumber1 = Math.floor(Math.random() * 10);
    const randomNumber2 = Math.floor(Math.random() * 10);

    setNumber1(randomNumber1);
    setNumber2(randomNumber2);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    const isSumCorrect = parseInt(sumAnswer) === number1 + number2;

    if (!isSumCorrect) {
      setError("Sum is incorrect. Please try again.");
      return;
    }

    console.log("before validating the user");

    const credentials = {
      username: username,
      password: password,
    };

    fetch("/api/user-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Resolves to parsed JSON
        } else if (response.status === 400) {
          setError("Please login with valid credentials or sign up");
        }
      })
      .then((data) => {
        console.log("User ID:", data.token);
        const twoDaysInSeconds = 2 * 24 * 60 * 60; // 2 days in seconds
        const expirationDate = new Date(
          Date.now() + twoDaysInSeconds * 1000
        ).toUTCString();

        document.cookie = `user_id=${data.token}; expires=${expirationDate}`;
        console.log("::::::::::document Cookie::::::::::::", document.cookie);
        console.log(
          "::::::::::::::::::::::",
          document.cookie.split(" ")[0].split("=")[1],
          " ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: "
        );
        navigate("/search");
      })
      .catch((error) => {
        console.error("Login failed:", error.message);
        setError("Please login with valid credentials or sign up");
      });
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleOnClickForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };
  return (
    <React.Fragment>
      {/* Navigation Bar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#0A0C4A",
          padding: "10px",
          color: "white",
          width: "100%",
          height: "400px",
          boxSizing: "border-box",
        }}
      >
        <ul style={{ listStyle: "none", display: "flex", width: "100%" }}>
          <li style={{ marginRight: "10px" }}>Home</li>
          <li style={{ marginRight: "10px" }}>Category</li>
          <li style={{ marginRight: "10px" }}>Features</li>
          <li
            style={{ marginRight: "10px" }}
            className={selectedTab === "login" ? "active" : ""}
            onClick={() => handleTabClick("login")}
          >
            Login
          </li>
          <li
            style={{ marginRight: "10px" }}
            className={selectedTab === "signup" ? "active" : ""}
            onClick={() => handleTabClick("signup")}
          >
            SignUp
          </li>
        </ul>
      </nav>

      {/* Colored Area for Login/Signup Tabs */}
      <div className="colored-area">
        <div
          className={`login-signup ${selectedTab === "login" ? "active" : ""}`}
        >
          {/* Login Content */}
          {selectedTab === "login" && (
            <div>
              {/* Input Fields */}
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={handleUsernameChange}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
              {/* Forgot Password */}
              <div>
                <button onClick={handleOnClickForgotPassword}>
                  Forgot Password
                </button>
              </div>
              <div>
                <p>
                  Solve the sum: {number1} + {number2}
                </p>
                <div>
                  <button onClick={handleOnRefreshNumbers}>Refresh</button>
                </div>
                <input
                  type="text"
                  placeholder="Enter the sum"
                  value={sumAnswer}
                  onChange={handleSumChange}
                />
              </div>
              {/* Login Button */}
              <button
                onClick={handleLogin}
                style={{ backgroundColor: "#0A0C4A", color: "white" }}
              >
                Login
              </button>
              <button onClick={handleSignUp}>Sign Up</button>
              {error && <p>{error}</p>}
              {/* Horizontal Line */}
              <hr />
              {/* Sign in with Text */}
              <p>Sign in with</p>
              {/* Social Media Options */}
              <div>
                <span>Google</span>
                <span>Facebook</span>
                <span>Microsoft</span>
                <span>GitHub</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rest of the Body with White Background */}
      <div className="white-background">{/* Other Content Goes Here */}</div>
    </React.Fragment>
  );
};

export default LoginPage;
