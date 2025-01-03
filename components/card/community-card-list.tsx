'use client'

import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useQueryClient } from '@tanstack/react-query'
import { COMMUNITY_KEY } from '@/lib/constants'
import { useEffect, useState } from 'react'
import { CommunityCard } from './community-card'
import { useInView } from 'react-intersection-observer'
import BeatLoader from 'react-spinners/BeatLoader'
import { useInfiniteCommunities } from '@/hooks/community'

export const CommunityCardList = () => {
  const [search, setSearch] = useState<string | undefined>(undefined)
  const { ref, inView } = useInView()
  const queryClient = useQueryClient()
  const {
    data,
    isSuccess,
    isFetching,
    fetchStatus,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteCommunities(search)

  useEffect(() => {
    if (!isFetching && inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage, isFetching])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get('search') as string
    setSearch(search)
    queryClient.invalidateQueries({ queryKey: [COMMUNITY_KEY] })
  }

  return (
    <div className="relative">
      <form
        className="absolute top-0 left-0 right-0 flex items-center border-b rounded-none focus-within:border-ring mx-4 h-11"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <SearchIcon size={20} />
        <Input
          placeholder="Search communities"
          name="search"
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </form>
      <div className="h-11" />
      {/* <div className="flex flex-col space-y-2 pt-2 overflow-auto h-[calc(100vh-270px)]"> */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        {isSuccess &&
          data.pages.map((page) =>
            page.communities.map((community) => {
              if (
                page.communities.indexOf(community) ===
                page.communities.length - 1
              ) {
                return (
                  <div key={community.id} ref={ref}>
                    <CommunityCard key={community.id} community={community} />
                  </div>
                )
              } else {
                return (
                  <CommunityCard key={community.id} community={community} />
                )
              }
            })
          )}
      </div>
      {fetchStatus === 'fetching' && (
        <div className="flex justify-center h-10 my-4">
          <BeatLoader className="h-10" />
        </div>
      )}
      {!hasNextPage && (
        <div className="flex items-center h-10 my-4 px-20">
          <div className="w-full border-b-2" />
        </div>
      )}
    </div>
  )
}
