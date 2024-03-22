'use client'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  return (
    <>
      <div className="space-y-6">
        <h1 className="text-6xl font-semibold">Auth</h1>
      </div>
      <p>Authentication Service</p>
      <div>
        <Button
          size="lg"
          onClick={() => {
            router.push('/auth/login')
          }}
        >
          Sign in
        </Button>
      </div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
      quisquam tempore possimus laborum temporibus quo voluptas nisi
      repudiandae, in libero, culpa nesciunt? Ad fugiat cumque error impedit,
      nobis illum at. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
      Nam, animi sapiente. Voluptatibus aut sunt cum culpa neque quibusdam
      perspiciatis vel, totam quasi, consectetur doloremque. Laudantium, iure.
      Expedita asperiores libero totam. Lorem ipsum dolor sit amet consectetur
      adipisicing elit. Ratione magni inventore soluta, repellendus optio
      laboriosam atque nihil autem accusantium quos incidunt modi eius odio
      labore perspiciatis maxime! Aliquid, cumque nostrum. Lorem ipsum dolor sit
      amet consectetur, adipisicing elit. Officiis sunt ad quod iusto obcaecati
      quibusdam maiores cupiditate. Illo suscipit, optio id obcaecati aspernatur
      accusamus. Ipsam autem quidem libero cupiditate id.
    </>
  )
}
