import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { auth } from '@/auth'
import { SessionProvider } from 'next-auth/react'
import { LeftSidebar } from '@/components/shared/left-sidebar'
import { MainContentWrapper } from '@/components/shared/main-content-wrapper'
import { RightSidebar } from '@/components/shared/right-sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IBZN',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <main className="flex">
            <LeftSidebar />
            <MainContentWrapper>{children}</MainContentWrapper>
            <RightSidebar />
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}