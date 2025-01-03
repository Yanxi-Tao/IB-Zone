'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sidebarNavs } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { UserAccountCard } from '@/components/card/user-account-card'
import { Badge } from '@/components/ui/badge'
import { useNotificationCount } from '@/hooks/notification'
import { formatNumber } from '@/lib/utils'
import Image from 'next/image'

export const LeftSidebar = () => {
  const pathname = usePathname()
  const { data, isSuccess } = useNotificationCount()
  return (
    <div className="sticky top-12 h-[calc(100vh-48px)] flex flex-col justify-between pb-10 pt-4 px-6 border-r">
      <div className="flex flex-col gap-y-3">
        <Link href="/" className="flex justify-center items-center">
          <Image
            src="/ibzn_logo.png"
            alt="IBZN"
            width={80}
            height={35}
            className=" my-2"
          />
        </Link>
        {sidebarNavs.map((nav, index) => {
          const isActive =
            (pathname.startsWith(nav.route) && nav.route.length > 1) ||
            pathname === nav.route ||
            (pathname.endsWith(nav.route) && pathname.startsWith('/community'))
          return (
            <Button
              key={index}
              variant="ghost"
              className={`flex min-w-[200px] max-w-[210px] justify-start p-6 ${
                isActive &&
                'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
              }`}
              asChild
            >
              <Link
                href={nav.route}
                className="relative flex items-center justify-start gap-x-2"
              >
                {<nav.icon size={24} />}
                <p>{nav.label}</p>
                {nav.route === '/notifications' && isSuccess && data > 0 && (
                  <Badge className="px-2" variant="destructive">
                    {formatNumber(data)}
                  </Badge>
                )}
              </Link>
            </Button>
          )
        })}
      </div>
      <UserAccountCard />
    </div>
  )
}
