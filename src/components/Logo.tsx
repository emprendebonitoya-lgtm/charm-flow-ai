type LogoProps = {
  className?: string;
};

export function Logo({ className = "h-14 w-14 object-contain" }: LogoProps) {
  return <img src="/logo.png" alt="MAGNETO" className={className} />;
}
