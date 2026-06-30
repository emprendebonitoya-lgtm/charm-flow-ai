type LogoProps = {
  className?: string;
};

export function Logo({ className = "h-14 w-14" }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="MAGNETO"
      className={`object-contain ${className}`}
      width={56}
      height={56}
    />
  );
}
