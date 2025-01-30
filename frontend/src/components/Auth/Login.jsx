import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      await login(formData);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 
                    transition-colors duration-200">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 
                         px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 
                         border border-gray-300 dark:border-gray-600 placeholder-gray-500 
                         dark:placeholder-gray-400 text-gray-900 dark:text-white 
                         rounded-t-md focus:outline-none focus:ring-blue-500 
                         focus:border-blue-500 dark:focus:ring-blue-400 
                         dark:focus:border-blue-400 focus:z-10 sm:text-sm
                         bg-white dark:bg-gray-700"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 
                         border border-gray-300 dark:border-gray-600 placeholder-gray-500 
                         dark:placeholder-gray-400 text-gray-900 dark:text-white 
                         rounded-b-md focus:outline-none focus:ring-blue-500 
                         focus:border-blue-500 dark:focus:ring-blue-400 
                         dark:focus:border-blue-400 focus:z-10 sm:text-sm
                         bg-white dark:bg-gray-700"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                       text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
                       dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link 
            to="/register" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 