import React from 'react';

const HomePage = () => {
    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <p>Please login or sign up to continue.</p>
            <a href="/login">Login </a> | <a href="/signup">Sign Up</a>
        </div>
    );
};

export default HomePage;
