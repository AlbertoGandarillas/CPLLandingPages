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
    <Button asChild variant={variant} size={size} className="w-full" {...props}>
      <Link href={href} target={target}>
        {children}
      </Link>
    </Button>
  );
}