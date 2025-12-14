const Error = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="text-center p-8">
      <div className="inline-block p-4 bg-red-50 rounded-full mb-4">
        <span className="text-4xl">😢</span>
      </div>
      <h3 className="text-xl font-semibold text-red-600 mb-2">Oops!</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-sweet-primary text-white rounded-lg hover:opacity-90"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;