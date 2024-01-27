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

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     // Email validation
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     const domainRegex = /@gmail\.com$/;
    //     if (!emailRegex.test(email) || !domainRegex.test(email)) {
    //         setErrorMessage('Please enter a valid Gmail address');
    //         return;
    //     }

    //     // Password validation
    //     const passwordRegex = /^(?=.*[@#])(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/;
    //     if (!passwordRegex.test(password)) {
    //         setErrorMessage('Password must contain the @ or # symbol, numbers, and be at least 8 characters long');
    //         return;
    //     }

    //     // Confirm password validation
    //     if (password !== confirmPassword) {
    //         setErrorMessage('Passwords do not match');
    //         return;
    //     }
    //     console.log(password, email, phoneNumber, subscriptionStatus)
    //     try {
    //         const response = await fetch('/api/create-user',  {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({            
    //                 email: "email@gmail.com",
    //                 password: "pasrd@123##",
    //                 phone_number: "111111111",
    //                 subscription_status: false})
    //         });
    //         const data = await response.json();
    //         console.log("data   ------------------------------- ", data)
    //         if (response.status === 200) {
    //             const userId = data.user_id;
    //             // document.cookie = `user_id=${userId}`;
    //             // console.log(document.cookie);
    //             navigate('/search');
    //         } else if (response.status === 400) {
    //         //    setErrorMessage(data.message);
    //             console.error();
    //         } else {
    //             console.error('Unexpected Error:', response.statusText,response.status);
    //         }
            // navigate(`/user-profile/${data.user_id}`);
        // } catch (error) {
        //     console.error('Error creating user:', error);
        // }
    // };
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
            console.log("daata ::::::: ",data);
            if(data){
                    console.log(response.status)
                    const userId = data.user_id;
                    document.cookie = `user_id=${userId}`;
                    console.log("document coookiee ::::::: ",document.cookie);
                    navigate('/search');

            }
            // navigate(`/user-profile/${data.user_id}`);
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
