type PortfolioStatusProps = {
  message: string;
};

export function PortfolioStatus({ message }: PortfolioStatusProps) {
  return (
    <p className="max-w-xl text-[length:var(--type-lead)] text-cream/70">
      {message}
    </p>
  );
}
