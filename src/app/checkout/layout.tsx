import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finalize seu pedido de brindes corporativos personalizados.",
  robots: { index: false },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
