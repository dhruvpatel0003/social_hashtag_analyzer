// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const UserProfile = () => {

//     const [user, setUser] = useState(null);
//     // const { user_id }= useParams();
//     const navigate = useNavigate();

//     const user_id = (document.cookie.split('; ').find(cookie => cookie.startsWith('user_id=')) || '').split('=')[1];
//     console.log("user_id", user_id);

//     useEffect(() => {
//         fetch('/api/get-user?user_id=' + user_id, { method: 'GET' })
//             .then(response => response.json())
//             .then(data => setUser(data))
//             .catch(error => console.log(error));
//     }, []);

//     if (!user) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div>
//             <button onClick={()=>navigate("/search")}>Back</button>
//             <h2>User Profile</h2>
//             <p>Email: {user.email}</p>
//             <p>Phone Number: {user.phone_number}</p>
//             <p>Password: {user.password}</p>
//             <p>Subscription Status : {user.subscription_status ? "Subscribed" : "Not Subscribed"}</p>
//         </div>
//     );

// };

// export default UserProfile;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const navigate = useNavigate();

  // Assuming you have the user_id stored in a cookie
  const user_id = (
    document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("user_id=")) || ""
  ).split("=")[1];
  const csrfToken = document.cookie.split(" ")[0].split("=")[1];

  useEffect(() => {
    // Fetch user profile data when the component mounts
    console.log("CSRF Token", csrfToken);
    console.log(document.cookie);
    fetch(`/api/get-user?user_id=${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {setUser(data);setProfilePhoto(data.profile_photo);})
      .catch((error) => console.log(error));
  }, [user_id]);

  const handleProfilePhotoUpdate = async (e) => {
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();
    console.log("profile photo data : ",e.target.elements.profile_photo.files);
    formData.append("profile_photo", e.target.elements.profile_photo.files[0]);
    console.log("formData :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: ",formData);
    // Make a POST request to update the profile photo
    const response = await fetch("/api/user-profile-photo/", {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRFToken": csrfToken,
      },
    });

    if (response.ok) {
      // Handle success, maybe update the user state with the new data
      console.log("Profile photo updated successfully");
    } else {
      // Handle error
      console.error("Failed to update profile photo");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={() => navigate("/search")}>Back</button>
      <h2>User Profile</h2>
      <p>Email: {user.email}</p>
      <p>Phone Number: {user.phone_number}</p>
      {/* Assuming you don't want to display the password for security reasons */}
      <p>Password: ********</p>
      <p>
        Subscription Status:{" "}
        {user.subscription_status ? "Subscribed" : "Not Subscribed"}
      </p>

      {/* Add a form for updating the profile photo */}
      <form encType="multipart/form-data" onSubmit={handleProfilePhotoUpdate}>
        <label htmlFor="profile_photo">Profile Photo:</label>
        <input
          type="file"
          id="profile_photo"
          name="profile_photo"
          accept="image/*"
        />
        <button type="submit">Update Profile Photo</button>
      </form>
    </div>
  );
};

export default UserProfile;
