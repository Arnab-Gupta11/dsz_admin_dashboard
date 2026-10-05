const LoadingSpinner = ({ LoadingText }: { LoadingText?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="bg-primary-50 absolute h-full w-full animate-[ping_1.5s_linear_infinite] rounded-full"></div>
        <div className="bg-primary-100/50 absolute h-10 w-10 animate-[ping_2s_linear_infinite] rounded-full"></div>
        <div className="bg-primary-100 relative h-6 w-6 rounded-full shadow-md"></div>
      </div>
      {LoadingText && (
        <p className="mt-4 animate-pulse text-sm font-medium text-gray-500 italic lg:text-lg">
          {LoadingText}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
