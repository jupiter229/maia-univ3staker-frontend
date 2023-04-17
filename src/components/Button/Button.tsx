import { ComponentProps } from "react";

export const Button: React.FC<ComponentProps<"button">> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={`py-2 px-4 bg-blue/25 rounded-2xl text-blue hover:text-blue/30 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
};
