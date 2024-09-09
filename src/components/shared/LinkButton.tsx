import { Button, ButtonProps } from "@/components/ui/button";
import Link from "next/link";

interface LinkButtonProps extends ButtonProps {
  href: string;
  target?: string;
}

export default function LinkButton({
  href,
  target = "_self",
  children,
  variant,
  size,
  ...props
}: LinkButtonProps) {
  return (
    <Link className="w-full" target={target} href={href} passHref>
      <Button asChild variant={variant} size={size} {...props}>
        <a>{children}</a>
      </Button>
    </Link>
  );
}
