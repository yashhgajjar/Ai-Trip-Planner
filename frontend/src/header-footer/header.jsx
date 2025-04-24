import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // For the hamburger menu icon
import { User } from "lucide-react";
import logo from "../assets/logo.png";

const Header = ({ buttons = [] }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data
    setIsLoggedIn(false); // Update state
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="pb-5">
      <header className="fixed top-0 left-0 w-full bg-gray-200 shadow-md text-gray-500 p-3 flex items-center justify-between z-50 h-20">
  {/* Logo + Heading Section */}
  <div
    className="flex items-center gap-2 cursor-pointer"
    onClick={() => navigate("/")}
  >
    <img src={logo} alt="AI Trip Planner" className="h-12 object-contain" />
    <span className="text-lg md:text-2xl font-semibold text-gray-500">
      AI Trip Planner
    </span>
  </div>

        {/* Conditional Rendering */}
        {isMobile ? (
          <div className="relative">
            <button
              className="md:hidden text-gray-600 p-2"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={28} />
            </button>

            {/* Sidebar */}
            <div
              className={`fixed top-0 right-0 h-full w-65 bg-white shadow-lg p-5 transform transition-transform ${
                menuOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <button
                className="absolute top-4 right-4 text-gray-600"
                onClick={() => setMenuOpen(false)}
              >
                <X size={28} />
              </button>

              <div className="mt-10 flex flex-col space-y-4">
                <button
                  onClick={() => {
                    if (localStorage.getItem("user")) {
                      localStorage.removeItem("user"); // Logout logic
                      navigate("/"); // Refresh to reflect logout state
                    } else {
                      navigate("/login"); // Navigate to login page
                    }
                  }}
                  className="px-4 py-2 border-1 border-blue-500 text-gray-700 rounded hover:bg-blue-400 hover:text-white"
                >
                  {localStorage.getItem("user") ? "Logout" : "Login"}
                </button>

                <button
                  onClick={() => navigate("/shareExp")}
                  className="px-4 py-2 border-1 border-blue-500 text-gray-700 rounded hover:bg-blue-400 hover:text-white"
                >
                  Share Experience
                </button>

                {/* Map through other buttons */}
                {buttons.map((button, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      navigate(button.path);
                      setMenuOpen(false);
                    }}
                    className={`px-4 py-2 border-1 border-blue-500 text-gray-700 rounded hover:bg-blue-400 hover:text-white ${
                      index === buttons.length - 1 ? "mb-3" : ""
                    }`}
                  >
                    {button.label}
                  </button>
                ))}

                {/* Logout Button at the bottom */}

                <center>
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-12 h-12 flex items-center justify-center bg-blue-400 text-white rounded-full shadow-md hover:bg-blue-700 transition-all duration-300"
                  >
                    <User size={24} />
                  </button>
                </center>
              </div>
            </div>
          </div>
        ) : (
          // Desktop view
          <div className="hidden md:flex space-x-4 ">
            <button
              onClick={() => {
                if (localStorage.getItem("user")) {
                  localStorage.removeItem("user"); // Logout logic
                  navigate("/"); // Refresh to reflect logout state
                } else {
                  navigate("/login"); // Navigate to login page
                }
              }}
              className="px-4 py-2 border-1 border-blue-500 text-gray-500 rounded hover:bg-blue-400 hover:text-white"
            >
              {localStorage.getItem("user") ? "Logout" : "Login"}
            </button>
            <button
              onClick={() => navigate("/shareExp")}
              className="px-4 py-2 border-1 border-blue-500 text-gray-500 rounded hover:bg-blue-400 hover:text-white"
            >
              Share Experience
            </button>

            {/* Buttons from the array */}
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={
                  button.onClick ? button.onClick : () => navigate(button.path)
                }
                className="px-4 py-2 border-1 border-blue-500 text-gray-500 rounded hover:bg-blue-400 hover:text-white"
              >
                {button.label}
              </button>
            ))}

            {/* Conditional Rendering of Logout/Login Button */}

            <button
              onClick={() => navigate("/profile")}
              className="w-12 h-12 flex items-center justify-center bg-blue-400 text-white rounded-full shadow-md hover:bg-blue-700 transition-all duration-300"
            >
              <User size={24} />
            </button>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
