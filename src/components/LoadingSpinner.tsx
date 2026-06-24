import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = "md", text, className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-fuchsia-400`} />
      {text && <p className="text-sm text-white/70">{text}</p>}
    </div>
  );
}
