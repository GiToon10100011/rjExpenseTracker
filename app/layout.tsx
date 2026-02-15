import type { Metadata, Viewport } from "next"
import { Noto_Sans_JP } from "next/font/google"

import "./globals.css"

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "家計簿 - Ron & Jin",
  description: "Ron & Jin の共有家計管理システム | Shared Household Expense Manager",
}

export const viewport: Viewport = {
  themeColor: "#1f1c19",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
