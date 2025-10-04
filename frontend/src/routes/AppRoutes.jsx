import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import UserRegister from '../pages/auth/UserRegister';
import ChooseRegister from '../pages/auth/ChooseRegister';
import UserLogin from '../pages/auth/UserLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import Home from '../pages/general/Home';
import Saved from '../pages/general/Saved';
import BottomNav from '../components/BottomNav';
import CreateFood from '../pages/food-partner/CreateFood';
import Profile from '../pages/food-partner/Profile';

const AppRoutesInner = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // If there's no token cookie, consider the visitor unauthenticated/new.
        // Allow access to register/login routes so users can sign up.
        const allowedPaths = [
            '/user/register',
            '/food-partner/register',
            '/user/login',
            '/food-partner/login',
            '/register'
        ];

        const hasToken = document.cookie && document.cookie.indexOf('token=') !== -1;

        if (!hasToken && !allowedPaths.includes(location.pathname)) {
            // redirect to user login for new/unauthenticated visitors
            navigate('/user/login', { replace: true });
        }
    }, [location.pathname, navigate]);

    return (
        <Routes>
            <Route path="/register" element={<ChooseRegister />} />
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
            <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
            <Route path="/" element={<><Home /><BottomNav /></>} />
            <Route path="/saved" element={<><Saved /><BottomNav /></>} />
            <Route path="/create-food" element={<CreateFood />} />
            <Route path="/food-partner/:id" element={<Profile />} />
        </Routes>
    )
}

const AppRoutes = () => {
    return (
        <Router>
            <AppRoutesInner />
        </Router>
    )
}

export default AppRoutes