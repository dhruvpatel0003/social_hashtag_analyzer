import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };


    const handleLogin = () => {
        console.log("before the validate the user");
        // console.log(username);
        // console.log(password);
        const encodedUsername = encodeURIComponent(username);
        const encodedPassword = encodeURIComponent(password);
        fetch(`/api/user-login?username=${encodedUsername}&password=${encodedPassword}`, { method: 'GET' })
        .then(response => {
            if (response.ok) {
                return response.json(); // This returns a promise that resolves to the parsed JSON
            } else if(response.status === 400) {
                // window.location.href = '/signup';
                setError('Please login with valid credentials or sign up');
                // throw new Error('Invalid username or password');
            }
        })
        .then(data => {
            console.log("User ID:", data.token);
            navigate('/search');
        })
        .catch(error => {
            console.error('Login failed:', error.message);
            setError('Please login with valid credentials or sign up');
        });     
    };

    const handleSignUp = () => {
        navigate('/signup');
    }


    return (
        <div>
            <h1>Login Page</h1>
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
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleSignUp}>SignUp</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default LoginPage;
