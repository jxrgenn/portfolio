export function LiftQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-12 border-l-2 border-[var(--color-accent)] py-4 pl-6">
      <p className="font-sans text-2xl italic leading-snug text-[var(--color-fg)]">
        {children}
      </p>
    </blockquote>
  );
}
