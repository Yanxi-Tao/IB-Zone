import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

type AuthCardWrapperProps = {
  children: React.ReactNode
  headerLabel: string
  redirectLabel: string
  redirecrPath: string
  showProvider?: boolean
}
export const AuthCardWrapper = ({
  children,
  headerLabel,
  redirectLabel,
  redirecrPath,
  showProvider = true,
}: AuthCardWrapperProps) => {
  return (
    <Card className="w-[400px] ">
      <CardHeader>
        <CardTitle className="text-center">{headerLabel}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showProvider && <AuthProviders />}
      <CardFooter className="justify-center">
        <Button variant="link" asChild>
          <Link href={redirecrPath}>{redirectLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

const AuthProviders = () => {
  return (
    <CardFooter className="flex gap-x-2">
      <Button variant="secondary" size="lg" className="w-full">
        <FcGoogle className="h-6 w-6 mr-2" />
        Google
      </Button>
      <Button variant="secondary" size="lg" className="w-full">
        <FaGithub className="h-6 w-6 mr-2" />
        Github
      </Button>
    </CardFooter>
  )
}
