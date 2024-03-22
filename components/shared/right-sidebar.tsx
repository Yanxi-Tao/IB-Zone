import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '../ui/button'

export const RightSidebar = () => {
  return (
    <div className="sticky top-0 z-20 h-screen border-l pt-16">
      <ScrollArea className="h-full w-fit px-6">
        <Button>Recommanded user</Button>
      </ScrollArea>
    </div>
  )
}
