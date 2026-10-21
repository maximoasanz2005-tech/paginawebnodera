import type { ButtonHTMLAttributes, ReactNode, CSSProperties } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

type ButtonAsButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    as?: "button";
  };

interface ButtonAsLinkProps extends BaseProps {
  as: "a";
  href: string;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", children, className = "", style } = props;
  const cls = `btn btn--${variant} btn--${size} ${className}`.trim();

  if (props.as === "a") {
    return (
      <a className={cls} href={props.href} style={style}>
        {children}
      </a>
    );
  }

  const { variant: _v, size: _s, children: _c, className: _cn, style: _st, ...rest } = props as ButtonAsButtonProps;
  return (
    <button className={cls} style={style} {...rest}>
      {children}
    </button>
  );
}
