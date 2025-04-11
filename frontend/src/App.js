import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUp from "./Signup";
import Home from "./home";
import Login from "./Login";
import Profile from "./profile";
import TripPlan from "./tripPlan";
import TripData from "./tripData";
import TripHistory from "./trip_imp/TripHistory";
import Chatbot from "./header-footer/chatbot";
import UserUpload from "./user_exp/UserUpload";
import ShareExp from "./user_exp/ShareExp";
import CheckWether from "./trip_imp/CheckWether";
import Map from "./components/map"
import ForgotPassword from "./pass-reset/ForgotPassword";
import ResetPassword from "./pass-reset/ResetPassword";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/tripPlan" element={<TripPlan />} />
      <Route path="/tripData" element={<TripData />} />
      <Route path="/tripHistory" element={<TripHistory />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/userUpload" element={<UserUpload />} />
      <Route path="/shareExp" element={<ShareExp />} />
      <Route path="/checkWether" element={<CheckWether />} />
      <Route path="/map" element={<Map />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

    </Routes>
  );
};

export default App;
