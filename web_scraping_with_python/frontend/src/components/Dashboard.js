import React, { useState } from "react";

const Dashboard = () => {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div>
      <div>
        <input type="text" placeholder="Search" />
      </div>
      <button>
        <h2>Profile</h2>
      </button>
      <div>
        <h2>Reports</h2>
      </div>
      <div>
        <h2>History</h2>
      </div>
    </div>
  );
};

export default Dashboard;
