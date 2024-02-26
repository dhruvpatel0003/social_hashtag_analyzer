import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {

    const [user, setUser] = useState(null);
    // const { user_id }= useParams();
    const navigate = useNavigate();

    const user_id = (document.cookie.split('; ').find(cookie => cookie.startsWith('user_id=')) || '').split('=')[1];
    console.log("user_id", user_id);

    useEffect(() => {
        fetch('/api/get-user?user_id=' + user_id, { method: 'GET' })
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(error => console.log(error));
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <button onClick={()=>navigate("/search")}>Back</button>
            <h2>User Profile</h2>
            <p>Email: {user.email}</p>
            <p>Phone Number: {user.phone_number}</p>
            <p>Password: {user.password}</p>
            <p>Subscription Status : {user.subscription_status ? "Subscribed" : "Not Subscribed"}</p>
        </div>
    );
    
};

export default UserProfile;
