import React, { useState } from 'react';
import Header from "../components/Header";
import { FcGoogle } from "react-icons/fc"; // Google
import { FaFacebookF } from "react-icons/fa"; // Facebook
import { FaApple } from "react-icons/fa"; // Apple
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa"; // Lock icon
import { FaUser } from "react-icons/fa"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';


function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useUser();

  // Move all state to main component level
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/users/register/`,
      {
        username,
        email,
        password,
        confirm_password: confirmPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );


     if (response.data.token) {       //added o
      localStorage.setItem('token', response.data.token);
    }

    setSuccess(`Signup successful! User ID: ${response.data.id}`);

    login({
      id: response.data. user.id,    //added users everywhere
      username: response.data.user.username,
      email: response.data.user.email,
    });

    navigate("/homepage");
  } catch (err) {
    const data = err.response?.data;

    if (!data) {
      setError("No response from server");
      return;
    }

    // Handle different error formats
    if (typeof data === "string") {
      setError(data);
    } else if (data.error) {
      setError(data.error);
    } else if (typeof data === "object") {
      const messages = Object.values(data)
        .flat()
        .join("\n");
      setError(messages);
    } else {
      setError("Unexpected error format");
    }
  }
};










  return (
    <div className="register-page">  
      <div>
        <Header/>
      </div>

      <div className="login-background ">
        <div className="login-container "> 
        

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

          <p className=" login-text-1"> Create account and get regular health updates </p>

          <labels className="textfield-labels "> Username </labels>
          <div className="relative w-full sm:w-[500px]">
            {/* Icon inside input */}
            <span className="">
              <FaUser className="icons" size={20} />
            </span>

            {/* Input field */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none border-[#CEECFF] focus:ring-2 focus:ring-[#57B9FF]"
            />
          </div>

          <p className="mr-[436px]"> email</p>
          <div className="relative w-[500px] mr-[10px]">
            {/* Icon inside input */}
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <MdEmail className="text-gray-400" size={20} />
            </span>

            {/* Input field */}
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none border-[#CEECFF] focus:ring-2 focus:ring-[#57B9FF]"
            />
          </div>

          <p className="mr-[436px]"> password</p>
          <div className="relative w-[500px] mr-[10px]">
            {/* Icon inside input */}
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaLock className="text-gray-400" size={20} />
            </span>

            {/* Input field */}
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none border-[#CEECFF] focus:ring-2 focus:ring-[#57B9FF]"
            />
          </div>

          <p className="mr-[436px]"> password</p>

          <div className="relative w-[500px] mr-[10px]">
            {/* Icon inside input */}
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaLock className="text-gray-400" size={20} />
            </span>

            {/* Input field */}
            <input
              type="password"
              placeholder=" confirm password "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none border-[#CEECFF] focus:ring-2 focus:ring-[#57B9FF]"
            />
          </div>

          <form onSubmit={handleSubmit}>
            <button type="submit" className="w-[500px] bg-[#57B9FF] hover:bg-[#77B1D4] rounded-2xl h-10">
              Register
            </button>
          </form>

      
          <div className="flex">   
            <p> already have an account? </p> 
            <p className="hover:underline  cursor-pointer"
            onClick={() => navigate('/login-page')}
            > login here</p>
          </div>
        </div>
      </div>
     {/* {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-2">{success}</p>} */}
    </div>
  );
}

export default RegisterPage;

