'use client'

import { useInView } from 'react-intersection-observer'
import { PostCard } from '@/components/card/post-card'
import { useEffect } from 'react'
import { useInfinitePosts } from '@/hooks/post'
import { useSearchParams } from 'next/navigation'
import { BeatLoader } from 'react-spinners'

export const ExploreDisplay = ({
  communitySlug,
  showCommunity = true,
}: {
  communitySlug?: string
  showCommunity?: boolean
}) => {
  const searchParams = useSearchParams()
  const search = searchParams.get('search') || undefined
  const { ref, inView } = useInView()
  const {
    data,
    isSuccess,
    isFetching,
    fetchStatus,
    hasNextPage,
    fetchNextPage,
  } = useInfinitePosts(search, communitySlug)

  useEffect(() => {
    if (!isFetching && inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage, isFetching])

  return (
    <div className="flex flex-col space-y-3">
      {isSuccess &&
        data.pages.map((page) =>
          page.posts.map((post) => {
            if (
              page.posts.indexOf(post) ===
              (page.posts.length < 2
                ? page.posts.length - 1
                : page.posts.length - 2)
            ) {
              return (
                <div key={post.id} ref={ref}>
                  <PostCard post={post} showCommunity={showCommunity} />
                </div>
              )
            } else {
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  showCommunity={showCommunity}
                />
              )
            }
          })
        )}
      {fetchStatus === 'fetching' && (
        <div className="flex justify-center h-10 my-4">
          <BeatLoader className="h-10" />
        </div>
      )}
      {!hasNextPage && fetchStatus !== 'fetching' && (
        <div className="flex items-center h-10 my-4 px-20">
          <div className="w-full border-b-2" />
        </div>
      )}
    </div>
  )
}
