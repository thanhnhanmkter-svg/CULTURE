// src/app/layout.js
import { Sora } from 'next/font/google'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata = {
  title: 'OPPO Workshop — Văn hóa Doanh nghiệp',
  description: 'Interactive workshop experience cho OPPO Việt Nam',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={sora.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
