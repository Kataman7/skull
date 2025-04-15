const AtmButton = ({ label, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-white ${disabled ? 'bg-gray-950' : 'bg-gray-900 hover:bg-gray-500'}`}
    >
      {label}
    </button>
  )
}

export default AtmButton