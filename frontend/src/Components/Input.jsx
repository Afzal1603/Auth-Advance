const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="w-full mb-6 relative">
      <div className="z-10 absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-green-500"></Icon>
      </div>
      <input
        {...props}
        className="z-10 w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg fborder border-gray-700 focus:border-green-500
        focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200 font-medium"
      />
    </div>
  );
};

export default Input;
