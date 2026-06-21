type LogoProps = {
  className?: string;
};

export function Logo({ className = "h-11 w-11" }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="MAGNETO"
      className={`object-contain ${className}`}
      width={44}
      height={44}
    />
  );
}
