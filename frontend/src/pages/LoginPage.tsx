import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import { loginUser } from '../lib/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await loginUser({ email, password });
    
      // Set cookies with a 7-day expiration
      Cookies.set('access_token', data.access_token, { expires: 7 });
      console.log('Access Token:', data.access_token);
      Cookies.set('refresh_token', data.refresh_token, { expires: 7 });
      Cookies.set('user', JSON.stringify(data.user), { expires: 7 });

      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/sign-up');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#d7e9f7] relative overflow-hidden">
      <img
        src="./images/cloud.webp"
        alt="Cloud background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      <h1 className="text-4xl md:text-5xl font-bold text-[#4b306a] z-10 mt-8 mb-2 text-center">
        Welcome to SynergyFlow
      </h1>
    
      <div className="flex flex-col items-center z-10 mb-4">
        <img src="./images/logo.webp" alt="SynergyFlow Logo" className="w-48 mb-2" />
        <span className="text-[#8699a6] font-medium text-lg">SynergyFlow</span>
      </div>
      
      {/* Кіцик */}
      <img
        src="./images/cute_cat.webp"
        alt="Cute cat"
        className="absolute right-80 top-75 w-60 md:w-20 z-10"
      />
      
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-sm z-10">
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#5c3d82] text-white py-2 rounded-full hover:bg-[#472f68] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'login'}
          </button>
          
          <div className="text-center text-sm text-gray-600">
            Don't have an account yet?
          </div>
          
          <button
            type="button"
            onClick={handleSignUp}
            className="bg-[#5c3d82] text-white py-2 rounded-full hover:bg-[#472f68] transition"
          >
            create account
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;