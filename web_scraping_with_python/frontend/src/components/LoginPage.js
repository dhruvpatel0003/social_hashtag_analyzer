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
        console.log("before validating the user");
    
        const credentials = {
            username: username,
            password: password
        };
    
        fetch('/api/user-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // Resolves to parsed JSON
            } else if (response.status === 400) {
                setError('Please login with valid credentials or sign up');
            }
        })
        .then(data => {
            console.log("User ID:", data.token);
            document.cookie = `user_id=${data.token}`;
            console.log("::::::::::::::::::::::", document.cookie," ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: ");
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
