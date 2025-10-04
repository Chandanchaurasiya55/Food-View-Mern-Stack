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
        // Verify auth by calling backend /api/auth/user/me which checks cookie token.
        // This handles token expiry/deletion server-side and avoids relying on document.cookie alone.
        const allowedPaths = [
            '/user/register',
            '/food-partner/register',
            '/user/login',
            '/food-partner/login',
            '/register'
        ];

        if (allowedPaths.includes(location.pathname)) return;

        let mounted = true;

        fetch(`${import.meta.env.VITE_API_URL}/api/auth/user/me`, {
            method: 'GET',
            credentials: 'include'
        }).then(async (res) => {
            if (!mounted) return;
            if (res.status === 200) {
                // user is authenticated; nothing to do
                return;
            }
            // on any 401 or other failure, redirect to login
            navigate('/user/login', { replace: true });
        }).catch(() => {
            if (!mounted) return;
            navigate('/user/login', { replace: true });
        });

        return () => { mounted = false };
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