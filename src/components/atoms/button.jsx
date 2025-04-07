const Button = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md text-white ${disabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'}`}
    >
      {label}
    </button>
  );
}

export default Button;