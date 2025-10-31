import React from "react";

const DivWithLeftBorder = ({
  children,
  className,
}: {
  children: React.ReactNode | React.ReactNode[] | string;
  className?: string;
}) => {
  return (
    <div className={`border-l-8 border-orange-600 px-4 ${className}`}>
      {children}
    </div>
  );
};

export default DivWithLeftBorder;
