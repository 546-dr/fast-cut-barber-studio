import React from 'react';

interface CrownProps {
  className?: string;
  size?: number;
}

export const CrownLogo: React.FC<CrownProps> = ({ className = 'w-6 h-6 text-[#F0B247]', size }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2.5 19H21.5V20.5H2.5V19Z" />
      <path d="M4 17.5H20L19 13.5L16 16L12 8L8 16L5 13.5L4 17.5Z" />
      <circle cx="4.5" cy="11.5" r="1.3" />
      <circle cx="12" cy="6" r="1.5" />
      <circle cx="19.5" cy="11.5" r="1.3" />
      <circle cx="8" cy="14" r="1" />
      <circle cx="16" cy="14" r="1" />
    </svg>
  );
};
