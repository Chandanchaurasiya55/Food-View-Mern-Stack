import React from 'react';
import '../../styles/auth-shared.css';
import axios from '../../setupAxios';
import { useNavigate } from 'react-router-dom';


// API_URL is configured in setupAxios via baseURL; use axios directly
const API_URL = import.meta.env.VITE_API_URL;

const FoodPartnerLogin = () => {

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(`/api/auth/food-partner/login`, {
        email,
        password
      });

      console.log(response.data);

      // mark that a food-partner has logged in so the frontend route-guard
      // which checks the current *user* won't immediately redirect away
      // (the backend still protects partner APIs server-side)
      localStorage.setItem('foodPartnerAuth', 'true');

      navigate("/create-food"); // Redirect to create food page after login
    } catch (err) {
      // basic error handling: show error message in console and keep user on the page
      console.error('Login failed', err?.response?.data || err);
      // optionally show user-friendly feedback (alert for now)
      alert(err?.response?.data?.message || 'Login failed');
    }

  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="partner-login-title">
        <header>
          <h1 id="partner-login-title" className="auth-title">Partner login</h1>
          <p className="auth-subtitle">Access your dashboard and manage orders.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="business@example.com" autoComplete="email" />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Password" autoComplete="current-password" />
          </div>
          <button className="auth-submit" type="submit">Sign In</button>
        </form>
        <div className="auth-alt-action">
          New partner? <a href="/food-partner/register">Create an account</a>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
