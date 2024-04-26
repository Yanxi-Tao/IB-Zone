import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

import Link from 'next/link'
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import {
  fetchCommunities,
  fetchCommunitiesByUser,
} from '@/actions/community/fetch-community'
import { COMMUNITY_FETCH_SPAN, COMMUNITY_KEY } from '@/lib/constants'
import { CommunityCardList } from '@/components/card/community-card-list'
import { CommunityCard } from '@/components/card/community-card'
import { currentUser } from '@/lib/auth'
import { Info } from 'lucide-react'
import { Suspense } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'

export default async function CommunitiesPage() {
  const user = await currentUser()
  if (!user || !user.id) return <div>Not logged in</div>
  const queryClient = new QueryClient()
  await queryClient.prefetchInfiniteQuery({
    queryKey: [COMMUNITY_KEY],
    queryFn: ({ pageParam }) => fetchCommunities(pageParam),
    initialPageParam: {
      search: undefined,
      offset: 0,
      take: COMMUNITY_FETCH_SPAN,
    },
    staleTime: Infinity,
  })
  const communities = await fetchCommunitiesByUser(user.id)
  return (
    <Suspense
      fallback={
        <div className="flex justify-center my-10">
          <PulseLoader color="#8585ad" />
        </div>
      }
    >
      <Card className="border-0 shadow-none">
        <CardHeader className="flex-row space-y-0 justify-between">
          <div className="flex space-x-2 items-center">
            <CardTitle>Communities</CardTitle>
            <HoverCard openDelay={300} closeDelay={0}>
              <HoverCardTrigger>
                <Info
                  size={16}
                  className="text-primary/60 hover:text-primary"
                />
              </HoverCardTrigger>
              <HoverCardContent>
                Topical communities where you can ask questions and seek answers
              </HoverCardContent>
            </HoverCard>
          </div>
          <Button>
            <Link href="/communities/create">Create</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs className="w-full" defaultValue="subscribed">
            <TabsList className="w-full">
              <TabsTrigger value="subscribed" className="w-full">
                My
              </TabsTrigger>
              <TabsTrigger value="browse" className="w-full">
                Browse
              </TabsTrigger>
            </TabsList>
            <TabsContent value="subscribed" className="w-full">
              <div className="flex flex-col space-y-2 overflow-auto h-[calc(100vh-270px)]">
                {communities.map((community) => (
                  <CommunityCard key={community.id} community={community} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="browse" className="w-full">
              <HydrationBoundary state={dehydrate(queryClient)}>
                <CommunityCardList />
              </HydrationBoundary>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Suspense>
  )
}
