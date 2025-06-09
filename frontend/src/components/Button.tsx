import classNames from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "default";
}

export const Button = ({ className, variant = "default", children, ...props }: ButtonProps) => {
  const baseStyle = "px-4 py-2 rounded font-semibold transition";
  const variantStyle = variant === "ghost" ? "bg-transparent text-gray-700 hover:bg-gray-200" : "bg-yellow-300 hover:bg-yellow-400";

  return (
    <button className={classNames(baseStyle, variantStyle, className)} {...props}>
      {children}
    </button>
  );
};
