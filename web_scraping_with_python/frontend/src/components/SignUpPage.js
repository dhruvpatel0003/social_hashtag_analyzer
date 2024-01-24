import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const domainRegex = /@gmail\.com$/;
        if (!emailRegex.test(email) || !domainRegex.test(email)) {
            setErrorMessage('Please enter a valid Gmail address');
            return;
        }

        // Password validation
        const passwordRegex = /^(?=.*[@#])(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setErrorMessage('Password must contain the @ or # symbol, numbers, and be at least 8 characters long');
            return;
        }

        // Confirm password validation
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, phone_number: phoneNumber, subscription_status: subscriptionStatus })
        };

        try {
            const response = await fetch('/api/create-user', requestOptions);
            const data = await response.json();
            console.log(data);
            navigate(`/user-profile/${data.user_id}`);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleLogin = () => {
        navigate('/login');
    }


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
            <label>
                Subscription Status:
                <input
                    type="checkbox"
                    checked={subscriptionStatus}
                    onChange={(e) => setSubscriptionStatus(e.target.checked)}
                />
            </label>
            <button onClick={handleSubmit}>Sign Up</button>
            <button onClick={handleLogin}>Login</button>
            
            {errorMessage && <p>{errorMessage}</p>}
            {password.length < 4 && <p>Password must be at least 8 characters long</p>}
        </div>
    );
};

export default SignUpPage;
