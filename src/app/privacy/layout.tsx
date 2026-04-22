export const metadata = {
  title: "Política de Privacidade | EX Voice",
  description:
    "Política de Privacidade da extensão Voice da Executivos Digital Software House.",
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-white">{children}</div>;
}
