import React from "react";

const WordWithLeftBorder = ({
  children,
  className,
}: {
    children: React.ReactNode | React.ReactNode[] | string;
    className?: string;
}) => {
  return (
    <span className={`relative ${className}`}>
      <span
        className="absolute -left-4 -top-3 border-l-8 border-orange-600 h-[150%]"
      ></span>
      {children}
    </span>
  );
};

export default WordWithLeftBorder;
