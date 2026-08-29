import "./globals.css";

export const metadata = {
  title: "Vincent AI V4 | Banking, Finance & Customer Experience",
  description: "Vincent AI V4 — intelligent banking, finance, customer experience, complaints, fraud, risk and automation assistant.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
