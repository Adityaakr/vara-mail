import './globals.css'

export const metadata = {
  title: 'Vara Network - Magic Authentication',
  description: 'Vara Network Web3 authentication powered by Magic.link - Seamless onboarding for VARA ecosystem',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
