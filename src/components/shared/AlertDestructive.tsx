import { ExclamationTriangleIcon, CheckCircledIcon, InfoCircledIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertProps {
  title: string;
  message: string;
  variant?: "default" | "destructive" | "warning" | "success" | "info" ;
}

export function AlertMessage({ title, message, variant = "default" }: AlertProps) {
  const icons = {
    destructive: <ExclamationTriangleIcon className="h-4 w-4" />,
    warning: <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />,
    success: <CheckCircledIcon className="h-4 w-4 text-green-500" />,
    info: <InfoCircledIcon className="h-4 w-4 text-blue-500" />,
    default: <InfoCircledIcon className="h-4 w-4" />
  };
  return (
    <Alert variant={variant === "warning" || variant === "info" ? "default" : variant === "success" ? "default" : variant}>
      {icons[variant] || icons["default"]}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  );
}
