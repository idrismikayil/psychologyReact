import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute.js";
import HomePage from "../pages/HomePage";
import TestPage from "../pages/TestPage";
import TestResult from "../pages/TestResult";
import Login from "../pages/Login/index";
import AboutUs from "../pages/AboutUs/index";
import ContactUs from "../pages/ContactUs/index";
import Blogs from "../pages/Blogs/index";
import BlogDetail from "../pages/BlogDetail/index";
import Profile from "../pages/Profile/index";
import TestPackages from "../pages/TestPackages/index.js";
import AdminLogin from "../pages/AdminLogin/index.js";
import AdminDashboard from "../pages/AdminDashboard/index.js";
import AdminUsers from "../pages/AdminUsers/index.js";
import AdminOrders from "../pages/AdminOrders/index.js";
import Register from "../pages/Register/index";
import VerifyEmail from "../pages/VerifyEmail/index";

import ForgotPassword from "../pages/Auth/ForgotPassword/index";
import ResetPassword from "../pages/Auth/ResetPassword/index";
import RedeemTest from "../pages/RedeemTest/index";

const AppRoutes = () => {

  return (
    <Routes>
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/" index element={<HomePage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/result" element={<TestResult />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog-detail/:id" element={<BlogDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/test-packages" element={<TestPackages />} />
      </Route>

      <Route path="admin" element={<AdminRoute />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>

      <Route path="admin/login" element={<AdminLogin />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/redeem/:token" element={<RedeemTest />} />
    </Routes>
  );
};

const Index = () => {
  return (
    <BrowserRouter basename="/">
      <AppRoutes />
    </BrowserRouter>
  );
};

export default Index;
