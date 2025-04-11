import React, { useEffect, useState } from "react";
import Header from "./header-footer/header";
import Footer from "./header-footer/footer";
import { useNavigate } from "react-router-dom";
import im12 from "./assets/im12.jpg";
const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Fetch user data from localStorage
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData)); // Set user data if logged in
    }
  }, []);

  // If the user is not logged in
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header
          buttons={
            isLoggedIn
              ? [
                  { label: "Plan Trip", path: "/tripPlan" },
                  { label: "History", path: "/tripHistory" },
                  { label: "Ask Ai", path: "/chatbot" },
                ]
              : [
                  { label: "Plan Trip", path: "/tripPlan" },
                  { label: "History", path: "/tripHistory" },
                  { label: "Ask Ai", path: "/chatbot" },
                ]
          }
        />

        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
          <p className="text-xl text-gray-700">
            You are not logged in. Please login to see your profile.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-6 py-3 bg-blue-400 text-white rounded-md hover:bg-blue-500"
          >
            Go to Login
          </button>
        </div>

        <Footer />
      </div>
    );
  }

  // Handle Logout (Clear from localStorage and reset state)

  // If the user is logged in, display profile information
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        buttons={
          isLoggedIn
            ? [
                { label: "Plan Trip", path: "/tripPlan" },
                { label: "History", path: "/tripHistory" },
                { label: "Ask Ai", path: "/chatbot" },
              ]
            : [
                { label: "Plan Trip", path: "/tripPlan" },
                { label: "History", path: "/tripHistory" },
                { label: "Ask Ai", path: "/chatbot" },
              ]
        }
      />

      <div
        className="flex-grow p-8 bg-transparent pt-20 pb-20"
        style={{
          backgroundImage: `url(${im12})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="max-w-4xl  max-h-4xl bg-transparent  flex justify-center items-center mx-auto mt-20"
          style={{
            // Shadows on top and bottom
            minWidth: "20vh",
            minHeight: "20vh", // Make the parent div take full viewport height
          }}
        >
          <div
            className="flex-grow p-8 pt-20 pb-20 rounded-lg"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.51)", // Light semi-transparent white
            }}
          >
            <center>
              <h1 className="text-2xl font-bold mb-6 text-gray-900">
                User Details
              </h1>

              <p>
                <strong>Full name:</strong> {user.firstName} {user.lastName}
              </p>
              <p>
                <strong>First name:</strong> {user.firstName}
              </p>
              <p>
                <strong>Last name:</strong> {user.lastName}
              </p>

              <p>
                <strong>Email:</strong> {user.email}
              </p>

              <button
                onClick={() => {
                  if (localStorage.getItem("user")) {
                    localStorage.removeItem("user"); // Logout logic
                    navigate("/"); // Refresh to reflect logout state
                  } else {
                    navigate("/login");
                  }
                }}
                className="px-4 py-2 border-1 border-black text-gray-900 rounded hover:bg-blue-400 hover:text-white mt-4"
              >
                {localStorage.getItem("user") ? "Logout" : "Login"}
              </button>
            </center>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
