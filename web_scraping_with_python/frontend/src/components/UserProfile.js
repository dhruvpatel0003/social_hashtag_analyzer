import { compareSync } from "bcryptjs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);

  const navigate = useNavigate();

  // Assuming you have the user_id stored in a cookie
  const user_id = (
    document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("user_id=")) || ""
  ).split("=")[1];
  const csrfToken = document.cookie.split(" ")[0].split("=")[1];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log(user_id);
        // Fetch user profile data when the component mounts
        const profileResponse = await fetch(
          `/api/get-user?user_id=${user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
          }
        );
        console.log("frontend",profileResponse);
        if (!profileResponse.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const profileData = await profileResponse.json();
        setUser(profileData);
        console.log("profile photo :::::::::::::::::::::::: ",profileData.profile_photo);
        if (profileData.profile_photo) {
          const data = "data:image/jpg;base64,"+profileData.profile_photo;
          console.log("printing the profile photo ",data);
          setProfilePhoto(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
  }, [user_id, csrfToken]);


  const handleProfilePhotoUpdate = async (e) => {
    e.preventDefault();

    const fileInput = e.target.elements.profile_photo.files[0];
   
    const reader = new FileReader();
    if (fileInput) {
      reader.onloadend = () => {
        console.log("render :::::::::::::::::: ",reader.result);
        setNewProfilePhoto(reader.result);
      };

      reader.readAsDataURL(fileInput);
    }
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("profile_photo",fileInput);

    const response = await fetch("/api/user-profile-photo", {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: formData,
    });

    if (response.ok) {
      console.log("Profile photo updated successfully");
      setProfilePhoto(newProfilePhoto);
    } else {
      console.error("Failed to update profile photo");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={() => navigate("/search")}>Back</button>
      <button></button>
      <h2>User Profile</h2>
      <p>Email: {user.email}</p>
      <p>Phone Number: {user.phone_number}</p>
      <p>Password: ********</p>
      <p>Suscribe amount : {user.subscription_status[0].subscription_amount}</p>
      <p>Subscribe At : {user.subscription_status[0].subscription_date}</p>
      <p>
        Expires At : {user.subscription_status[0].subscription_expires_date}
      </p>

      {profilePhoto && <img src={profilePhoto} alt="Profile" />}

      <form onSubmit={handleProfilePhotoUpdate}>
        <label htmlFor="profile_photo">Profile Photo:</label>
        <input
          type="file"
          id="profile_photo"
          name="profile_photo"
          accept="image/*"
        />
        <button type="submit">Upload</button>
      </form>
      {newProfilePhoto && <img src={newProfilePhoto} alt="New Profile" />}
    </div>
  );
};

export default UserProfile;
