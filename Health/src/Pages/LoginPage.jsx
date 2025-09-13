import React, { useState } from 'react';
import Header from "../components/Header";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import "../style/animations.css";
import "../style/LoginPage.css";


function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const isAdminLogin = email.includes('@example.com'); // Adjust pattern if needed

    try {
      const endpoint = isAdminLogin
        ? `${import.meta.env.VITE_API_BASE_URL}/hospitals/login/`
        : `${import.meta.env.VITE_API_BASE_URL}/users/login/`;
      const response = await axios.post(endpoint, { email, password });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('is_admin', isAdminLogin.toString());
      setSuccess('Login successful!');
      login({
        id: response.data.id,
        username: response.data.username || response.data.email,
        email: response.data.email,
        is_admin: isAdminLogin
      });

      navigate(isAdminLogin ? '/hi' : '/homepage');
    } catch (err) {
      setError(err.response?.data?.error || `Failed to log in to ${isAdminLogin ? 'admin' : 'user'} account`);
    }
  };

  return (
    <div className="login-page">
      <Header />

      <div className=" login-background">
        {/* Responsive container with pop-in animation */}
        <div className=" login-container animate-fade-slide ">
          <p className="login-text-1">
            Login into Cameroon's health info website
          </p>

          {error && <div className="text-red-500 text-center">{error}</div>}
          {success && <div className="text-green-500 text-center">{success}</div>}

          <form onSubmit={handleSubmit} className=" login-form-layout">
            {/* Email */}
            <label className=" textfield-labels ">Email</label>
            <div className="relative w-full sm:w-[500px]">
              <MdEmail className="icons " size={20} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className=" text-fields"
                required
              />
            </div>

            {/* Password */}
            <label className="textfield-labels  ">Password</label>
            <div className="relative w-full sm:w-[500px]">
              <FaLock className=" icons " size={20} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className=" text-fields "
                required
              />
            </div>

            <p className=" forgot-password ">Forgot password?</p>

            <button
              type="submit"
              className=" submit-button "
            >
              Login
            </button>
          </form>

          <p className="text-center mt-2">.....or login with....</p>
          <div className="flex gap-4 mt-2 flex-wrap justify-center">
            <button className=" google-buttons ">
              <FcGoogle size={24} />
            </button>
            <button className=" google-buttons ">
              <FaFacebookF size={24} />
            </button>
            <button className=" google-buttons ">
              <FaApple size={24} />
            </button>
          </div>

          <div className="flex gap-1 text-sm mt-4 justify-center">
            <p>No account yet?</p>
            <p className=" register-here ">Please register here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;






























