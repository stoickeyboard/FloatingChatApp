import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: ReactNode;
  shouldFill?: boolean;
  className?: string;
}

export default function IconButton({
  children,
  shouldFill,
  className,
  ...rest
}: Props) {
  return (
    <button
      className={`flex h-10 w-10 items-center justify-center [&_svg]:h-6 [&_svg]:w-6 ${shouldFill ? "[&_svg>*]:fill-primaryText" : ""
        } ${className ? className : ""}`}
      {...rest}
    >
      {children}
    </button>
  );
}
