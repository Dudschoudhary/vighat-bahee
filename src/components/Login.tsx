import React, { useState, ChangeEvent, FormEvent } from 'react';

/* ──────────────────────────
   Types
   ──────────────────────────*/
type Mode = 'login' | 'register';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  address: string;
  password: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

/* ──────────────────────────
   Component
   ──────────────────────────*/
const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [loginData, setLoginData] = useState<LoginData>({ email: '', password: '' });
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: '',
    email: '',
    address: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  /* ──────────────────────────
     Helpers
     ──────────────────────────*/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const clearErrors = (field: string) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (mode === 'login') {
      if (!loginData.email.trim()) newErrors.email = 'Email is required';
      else if (!emailRegex.test(loginData.email)) newErrors.email = 'Invalid email';
      if (!loginData.password) newErrors.password = 'Password is required';
    } else {
      if (!registerData.name.trim()) newErrors.name = 'Name is required';
      if (!registerData.email.trim()) newErrors.email = 'Email is required';
      else if (!emailRegex.test(registerData.email)) newErrors.email = 'Invalid email';
      if (!registerData.address.trim()) newErrors.address = 'Address is required';
      if (!registerData.password) newErrors.password = 'Password is required';
      else if (registerData.password.length < 6)
        newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ──────────────────────────
     Handlers
     ──────────────────────────*/
  const handleChange =
    (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      mode === 'login'
        ? setLoginData(prev => ({ ...prev, [field]: e.target.value }))
        : setRegisterData(prev => ({ ...prev, [field]: e.target.value }));
      clearErrors(field);
    };

  const handleRememberMeChange = (e: ChangeEvent<HTMLInputElement>) =>
    setRememberMe(e.target.checked);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await new Promise<void>(res => setTimeout(res, 1000)); // mock API
      const payload = mode === 'login' ? { ...loginData, rememberMe } : registerData;
      console.log(`${mode.toUpperCase()} SUBMITTED:`, payload);
      // TODO: Real API call or navigation
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /* ──────────────────────────
     UI
     ──────────────────────────*/
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </h2>

          {mode === 'login' ? (
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <button
                onClick={() => {
                  setMode('register');
                  setErrors({});
                }}
                className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
              >
                create a new account
              </button>
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setMode('login');
                  setErrors({});
                }}
                className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
              >
                Back to sign&nbsp;in
              </button>
            </p>
          )}
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Name"
                value={registerData.name}
                onChange={handleChange('name')}
                className={`block w-full px-3 py-2 border ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email address"
              value={mode === 'login' ? loginData.email : registerData.email}
              onChange={handleChange('email')}
              className={`block w-full px-3 py-2 border ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              } ${mode === 'register' ? 'rounded-none' : 'rounded-t-md'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          {mode === 'register' && (
            <div>
              <label htmlFor="address" className="sr-only">
                Address
              </label>
              <textarea
                id="address"
                placeholder="Address"
                value={registerData.address}
                onChange={handleChange('address')}
                className={`block w-full px-3 py-2 border ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                } rounded-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>
          )}

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"    
              value={mode === 'login' ? loginData.password : registerData.password}
              onChange={handleChange('password')}
              className={`block w-full px-3 py-2 border ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              } ${mode === 'register' ? 'rounded-none' : 'rounded-b-md'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {mode === 'login' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={() => console.log('Forgot password')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
