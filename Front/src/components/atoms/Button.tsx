interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
  }
  
  export function Button({ onClick, children }: ButtonProps) {
    return (
      <button
        onClick={onClick}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        {children}
      </button> 
    );
  }