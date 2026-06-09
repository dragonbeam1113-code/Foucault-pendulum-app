import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "フーコーの振り子",
  description: "緯度を入力して、フーコーの振り子の見かけの回転周期を確認できます",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
