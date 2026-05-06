// Preview-only layout — hides the global NavBar/Footer/ScrollProgress chrome
// via scoped CSS so the editorial sandbox renders full-bleed.

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        body > div.fixed.inset-x-0.top-0,
        body > header,
        body > footer { display: none !important; }
        body > main { margin: 0 !important; padding: 0 !important; }
      `}</style>
      {children}
    </>
  );
}
