import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, User, Lock, Eye, EyeOff, Briefcase } from 'lucide-react';

const registerSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .required('Username is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  isAdmin: yup.boolean(),
});

const RegisterForm = ({ onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      isAdmin: false,
    },
  });

  const password = watch('password');

  const passwordStrength = () => {
    if (!password) return { score: 0, text: 'None', color: 'gray' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score, text: 'Weak', color: 'red' };
    if (score <= 4) return { score, text: 'Good', color: 'yellow' };
    return { score, text: 'Strong', color: 'green' };
  };

  const strength = passwordStrength();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Username Field */}
      <div>
        <label htmlFor="username" className="sweet-label">
          <div className="flex items-center space-x-2">
            <User size={16} className="text-sweet-primary" />
            <span>Username</span>
          </div>
        </label>
        <input
          id="username"
          type="text"
          {...register('username')}
          className={`sweet-input ${errors.username ? 'sweet-input-error' : ''}`}
          placeholder="Choose a username"
          disabled={loading}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="sweet-label">
          <div className="flex items-center space-x-2">
            <Mail size={16} className="text-sweet-primary" />
            <span>Email Address</span>
          </div>
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={`sweet-input ${errors.email ? 'sweet-input-error' : ''}`}
          placeholder="you@example.com"
          disabled={loading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="sweet-label">
          <div className="flex items-center space-x-2">
            <Lock size={16} className="text-sweet-primary" />
            <span>Password</span>
          </div>
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className={`sweet-input ${errors.password ? 'sweet-input-error' : ''} pr-10`}
            placeholder="Create a strong password"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sweet-dark/50 hover:text-sweet-primary"
            disabled={loading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        {/* Password Strength */}
        {password && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-sweet-dark">
                Password strength: <span className={`text-${strength.color}-600`}>{strength.text}</span>
              </span>
              <span className="text-xs text-sweet-dark/70">{strength.score}/5</span>
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full ${
                    i <= strength.score
                      ? `bg-${strength.color}-500`
                      : 'bg-sweet-light'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
        
        <div className="mt-2 text-xs text-sweet-dark/60">
          Must contain: uppercase, lowercase, number, min 8 characters
        </div>
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="passwordConfirm" className="sweet-label">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="passwordConfirm"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('passwordConfirm')}
            className={`sweet-input ${errors.passwordConfirm ? 'sweet-input-error' : ''} pr-10`}
            placeholder="Confirm your password"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sweet-dark/50 hover:text-sweet-primary"
            disabled={loading}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.passwordConfirm && (
          <p className="mt-1 text-sm text-red-600">{errors.passwordConfirm.message}</p>
        )}
      </div>

      {/* Admin Checkbox */}
      <div className="bg-sweet-light/30 p-4 rounded-lg">
        <div className="flex items-center">
          <input
            id="isAdmin"
            type="checkbox"
            {...register('isAdmin')}
            className="h-4 w-4 text-sweet-primary rounded border-sweet-light focus:ring-sweet-primary/20"
            disabled={loading}
          />
          <label htmlFor="isAdmin" className="ml-3 flex items-center space-x-2">
            <Briefcase size={16} className="text-sweet-primary" />
            <div>
              <span className="text-sm font-medium text-sweet-dark">
                Register as Admin
              </span>
              <p className="text-xs text-sweet-dark/60">
                (Admin accounts have full access to all features)
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="flex items-start">
        <input
          id="terms"
          type="checkbox"
          className="h-4 w-4 text-sweet-primary rounded border-sweet-light focus:ring-sweet-primary/20 mt-1"
          required
          disabled={loading}
        />
        <label htmlFor="terms" className="ml-2 text-sm text-sweet-dark">
          I agree to the{' '}
          <button type="button" className="text-sweet-primary hover:underline">
            Terms of Service
          </button>{' '}
          and{' '}
          <button type="button" className="text-sweet-primary hover:underline">
            Privacy Policy
          </button>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full sweet-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Creating account...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <User size={20} />
            <span className="text-lg">Create Account</span>
          </div>
        )}
      </button>

      {/* Security Note */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-700 text-center">
          🔒 Your data is secure. We use industry-standard encryption to protect your information.
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;