const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-sweet-primary to-sweet-accent text-white hover:shadow-lg',
    secondary: 'bg-sweet-secondary text-white hover:shadow-lg',
    outline: 'border-2 border-sweet-primary text-sweet-primary hover:bg-sweet-primary hover:text-white',
    ghost: 'text-sweet-dark hover:bg-sweet-light',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          Loading...
        </span>
      ) : children}
    </button>
  );
};

export default Button;