'use client';

interface ApexLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ApexLogo({ size = 'md', className = '' }: ApexLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative flex items-center`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Three mountain peaks - exact match to deployed site */}
        <path
          d="M2 20 L8 8 L12 14 L16 6 L22 20 Z"
          fill="#0EA5E9"
          stroke="#0284C7"
          strokeWidth="0.5"
        />
        
        {/* Highlight on tallest peak */}
        <path
          d="M14 6 L16 6 L18 12 L14 12 Z"
          fill="#38BDF8"
        />
        
        {/* Left peak highlight */}
        <path
          d="M6 8 L8 8 L10 14 L6 14 Z"
          fill="#0284C7"
        />
      </svg>
    </div>
  );
}
