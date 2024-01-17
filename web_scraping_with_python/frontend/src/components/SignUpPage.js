import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, "phone_number": phoneNumber, "subscription_status": subscriptionStatus })
        };

        try {
            const response = await fetch('/api/create-user', requestOptions);
            const data = await response.json();
            console.log(data);
            navigate(`/user-profile/${data.user_id}`);
            console.log('Not able to navigate to user profile page');
        } catch (error) {
            console.error('Error creating user:', error);
        }
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
                placeholder="Password"
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
        </div>
    );
};

export default SignUpPage;
