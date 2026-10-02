import type React from "react"
import type { Metadata, Viewport } from "next"
import { Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs"
import { ptBR } from "@clerk/localizations"
import { LenisProvider } from "@/components/providers/lenis-provider"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

const description =
  "Envie o memorial descritivo, converta DMS para UTM automaticamente, confira o polígono e exporte planilha e DXF para o AutoCAD. Sem retrabalho manual."

export const metadata: Metadata = {
  title: "TopoCAD — Memorial descritivo em PDF para DXF",
  description,
  generator: "v0.app",
  applicationName: "TopoCAD",
  openGraph: {
    title: "TopoCAD — Memorial descritivo em PDF para DXF",
    description,
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
}

const clerkIsConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    (process.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY_4),
)

function AppContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LenisProvider>{children}</LenisProvider>
      <Analytics />
    </>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cal+Sans&family=Instrument+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${manrope.variable} font-sans antialiased bg-zinc-950 text-zinc-100`}>
        {clerkIsConfigured ? (
          <ClerkProvider
            localization={ptBR}
            appearance={{
              variables: {
                colorPrimary: "#f4f4f5",
                colorPrimaryForeground: "#18181b",
                colorBackground: "#18181b",
                colorForeground: "#f4f4f5",
                colorMutedForeground: "#a1a1aa",
                colorInput: "#27272a",
                colorInputForeground: "#f4f4f5",
                colorNeutral: "#f4f4f5",
                borderRadius: "0.75rem",
                fontFamily: "var(--font-manrope), sans-serif",
              },
            }}
          >
            <AppContent>{children}</AppContent>
          </ClerkProvider>
        ) : (
          <AppContent>{children}</AppContent>
        )}
      </body>
    </html>
  )
}
