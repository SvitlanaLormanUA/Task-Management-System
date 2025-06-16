import React from 'react';

type SquareProps = {
  title: string;
  children?: React.ReactNode;
  color?: string;
  className?: string;
  onClick?: () => void;
};

const Square: React.FC<SquareProps> = ({ title, children, color, className, onClick }) => (
  <div
    className={`rounded-lg shadow-md p-8 size-44 flex items-center justify-center text-center cursor-pointer hover:scale-105 relative ${className ? ` ${className}` : ''}`}
    style={{ backgroundColor: color || 'white' }}
    onClick={onClick}
  >
    <div className="w-full h-full flex flex-col items-center justify-center text-left">
      <h2 className="absolute top-2 left-4 text-lg mt-2 flex flex-wrap max-w-30 dark:text-black">{title}</h2>
      {children}
    </div>
  </div>
);

export default Square;