import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import ExchangeRates from './ExchangeRates';
import { Helmet } from 'react-helmet';

const Login = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = 'http://localhost:5000/auth/facebook';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/login',
        { email, password },
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Киришда хатолик');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Helmet>
        <title>Система учёта долгов</title>
      </Helmet>
      
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 flex items-center justify-center">
          <ExchangeRates />
        </div>
        <div className="w-full md:w-2/3 flex justify-center">
          <div className="w-full max-w-md">
            <h3 className="text-2xl font-bold text-center mb-6">Система учёта долгов</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-700">Электрон почта</label>
                <input
                  type="email"
                  placeholder="Электрон почта"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Пароль</label>
                <input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              >
                Войти
              </button>
            </form>
            <div className="text-center my-4 text-gray-600">или</div>
            <div className="flex gap-4">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center w-1/2 py-2 border rounded-md hover:bg-gray-200 transition"
              >
                <FcGoogle className="mr-2" size={22} /> Google
              </button>
              <button
                onClick={handleFacebookLogin}
                className="flex items-center justify-center w-1/2 py-2 border rounded-md hover:bg-gray-200 transition"
              >
                <FaFacebook className="mr-2 text-blue-600" size={22} /> Facebook
              </button>
            </div>
            <p className="text-center mt-4">
              <a href="/register" className="text-blue-500 hover:underline">Регистрация</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
