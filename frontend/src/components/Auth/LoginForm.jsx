import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginForm = ({ onSubmit, loading }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: 'admin@example.com',
      password: 'admin123',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="sweet-label">
          <div className="flex items-center space-x-2">
            <Mail size={16} className="text-sweet-primary" />
            <span>Email Address</span>
          </div>
        </label>
        <div className="relative">
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
            placeholder="Enter your password"
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
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        <div className="flex justify-end mt-2">
          <button
            type="button"
            className="text-sm text-sweet-primary hover:text-sweet-accent transition-colors"
            disabled={loading}
          >
            Forgot password?
          </button>
        </div>
      </div>

      {/* Remember Me */}
      <div className="flex items-center">
        <input
          id="remember"
          type="checkbox"
          className="h-4 w-4 text-sweet-primary rounded border-sweet-light focus:ring-sweet-primary/20"
          disabled={loading}
        />
        <label htmlFor="remember" className="ml-2 text-sm text-sweet-dark">
          Remember me for 30 days
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
            <span>Signing in...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <Lock size={20} />
            <span className="text-lg">Sign In</span>
          </div>
        )}
      </button>

      {/* Quick Login Hint */}
      <div className="text-center">
        <p className="text-sm text-sweet-dark/60">
          Tip: You can use the demo credentials above
        </p>
      </div>
    </form>
  );
};

export default LoginForm;