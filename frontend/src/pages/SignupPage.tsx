import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from '@/api/useApiClient';
import Cookies from 'js-cookie';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const navigate = useNavigate();
  const apiClient = useApiClient();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Please enter a valid email';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Fixed: Handle apiClient response properly
      const data = await apiClient.post('http://127.0.0.1:5000/signup', { 
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      }); 

      // Store tokens and user data
      Cookies.set('access_token', data.access_token, { expires: 7 });
      Cookies.set('refresh_token', data.refresh_token, { expires: 7 });
      Cookies.set('user', JSON.stringify(data.user), { expires: 7 });

      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);

    } catch (err) {
      console.error('Signup error:', err);
      
      // Handle different error scenarios
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      const statusCode = err.response?.status;
      
      if (errorMessage.includes('User already exists') || 
          errorMessage.includes('USER_EXISTS') || 
          statusCode === 409) {
        setError('User already exists. Want to login?');
        setUserExists(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(errorMessage === 'Invalid email or password' ? 
                'Please check your email and password' : 
                errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (userExists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#d7e9f7] relative overflow-hidden">
        <img
          src="/images/cloud.webp"
          alt="Cloud background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm z-10 text-center border-l-4 border-orange-400">
          <div className="text-6xl mb-4">👋</div>
          <h2 className="text-2xl font-bold text-[#4b306a] mb-4">Welcome back!</h2>
          <p className="text-gray-600 mb-4">User already exists. Want to login?</p>
          <p className="text-sm text-gray-500 mb-6">Redirecting to login page...</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/login')}
              className="bg-[#5c3d82] text-white py-2 px-6 rounded-full hover:bg-[#472f68] transition"
            >
              Go to Login
            </button>
            <button
              onClick={() => {
                setUserExists(false);
                setFormData({ name: '', email: '', password: '' });
                setError('');
              }}
              className="text-[#5c3d82] py-2 px-6 rounded-full border border-[#5c3d82] hover:bg-[#5c3d82] hover:text-white transition"
            >
              Try Different Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#d7e9f7] relative overflow-hidden">
        <img
          src="/images/cloud.webp"
          alt="Cloud background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm z-10 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[#4b306a] mb-4">Welcome!</h2>
          <p className="text-gray-600 mb-6">Your account has been created successfully.</p>
          <button
            onClick={() => {
              setSuccess(false);
              setFormData({ name: '', email: '', password: '' });
            }}
            className="bg-[#5c3d82] text-white py-2 px-6 rounded-full hover:bg-[#472f68] transition"
          >
            Create Another Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#d7e9f7] relative overflow-hidden dark:text-black">
      <img
        src="/images/cloud.webp"
        alt="Cloud background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <h1 className="text-4xl md:text-5xl font-bold text-[#4b306a] z-10 mt-8 mb-6 text-center">
        Create Your Account
      </h1>
      <div className="z-10 mb-6">
        {/* Avatar section commented out */}
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm z-10">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
              placeholder="Your name"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#5c3d82] text-white py-4 px-6 rounded-full hover:bg-[#472f68] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;