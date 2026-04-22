export const metadata = {
  title: "Termos de Uso | EX Voice",
  description:
    "Termos de Uso da extensão Voice da Executivos Digital Software House.",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-white">{children}</div>;
}
