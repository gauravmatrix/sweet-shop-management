const Loading = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizes[size]} animate-spin rounded-full border-t-2 border-b-2 border-sweet-primary`}></div>
      {text && <p className="mt-4 text-sweet-dark font-medium">{text}</p>}
    </div>
  );
};

export default Loading;