'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { BiSolidDownvote, BiUpvote, BiSolidUpvote, BiDownvote } from 'react-icons/bi'
import { HiDotsHorizontal } from 'react-icons/hi'
import { HiFlag } from 'react-icons/hi2'
import { FiEdit } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'
import { BsChatSquare, BsBookmark, BsBookmarkFill } from 'react-icons/bs'
import { formatNumber } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { QuestionDisplayProps } from '@/lib/types'
import { AnswerForm } from '@/components/form/post-form'
import { ANSWERS_FETCH_SPAN } from '@/lib/constants'
import { useQueryClient } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { PostCard, optimisticAnswer } from '@/components/card/post-card'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useInfiniteAnswers } from '@/hooks/post/useInfiniteAnswers'
import { useMutateAnswer } from '@/hooks/post/useMutateAnswer'
import { BeatLoader } from 'react-spinners'
import { Separator } from '@/components/ui/separator'
import { AvatarCard } from '@/components/card/avatar-card'
import { deletePost } from '@/actions/post/delete-post'
import { useUpdateVote } from '@/hooks/useUpdateVote'
import { useUpdateBookmark } from '@/hooks/useUpdateBookmark'

export default function QuestionDisplay({
  id,
  title,
  content,
  author,
  community,
  bookmarks,
  updatedAt,
  _count,
  upVotes,
  downVotes,
}: QuestionDisplayProps) {
  const user = useCurrentUser()
  const updateBookmark = useUpdateBookmark()
  const updateVote = useUpdateVote('post')
  const { ref, inView } = useInView()

  const { isPending, variables, mutate } = useMutateAnswer(useQueryClient())
  const { data, isSuccess, fetchStatus, hasNextPage, fetchNextPage } = useInfiniteAnswers({
    parentId: id,
    offset: 0,
    take: ANSWERS_FETCH_SPAN,
  })

  const userVoteStatus = upVotes.find((vote) => vote.id === user?.id) ? 1 : downVotes.find((vote) => vote.id === user?.id) ? -1 : 0
  const userBookmarkStatus = bookmarks.find((bookmark) => bookmark.id === user?.id) ? true : false
  const baseCount = upVotes.length - downVotes.length - userVoteStatus
  const [voteStatus, setVoteStatus] = useState(userVoteStatus)
  const [bookmarkStatus, setBookmarkStatus] = useState(userBookmarkStatus)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  if (!user || !user.name || !user.email || !user.id) {
    return null
  }

  return (
    <div>
      <Card className="border-0 shadow-none">
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-sm">
              {community && (
                <>
                  <Link href={`/communities/${community.slug}`}>
                    <AvatarCard source={null} name={community.name} className="w-7 h-7 text-sm" />
                  </Link>
                  <Link href={`/communities/${community.slug}`} className="text-primary underline-offset-4 hover:underline">
                    <span>{community.name}</span>
                  </Link>
                  <span>/</span>
                </>
              )}
              <Link href={`/profile/${author.slug}`}>
                <AvatarCard source={author.image} name={author.name} className="w-7 h-7 text-sm" />
              </Link>
              <Link href={`/profile/${author.slug}`} className="text-primary underline-offset-4 hover:underline">
                <span>{author.name}</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs">{new Date(updatedAt).toDateString()}</span>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <HiDotsHorizontal size={20} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <HiFlag size={16} className="mr-2" />
                    Report
                  </DropdownMenuItem>
                  {user?.id === author.id && (
                    <>
                      <DropdownMenuItem>
                        <FiEdit size={16} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => deletePost(id, 'question')}>
                        <MdDelete size={16} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <CardTitle className=" leading-normal">{title}</CardTitle>
        </CardHeader>
        <CardContent className="max-w-[820px]">
          <div className="editor w-full" dangerouslySetInnerHTML={{ __html: content }} />
        </CardContent>
        <CardFooter className="py-0 pb-4 flex justify-between">
          <div className="flex items-center space-x-4">
            <ToggleGroup
              type="single"
              onValueChange={(value) => {
                const voteValue = value === 'up' ? 1 : value === 'down' ? -1 : 0
                setVoteStatus(voteValue)
                updateVote(id, user.id as string, voteValue)
              }}
              className=" bg-muted/50 rounded-lg"
            >
              <ToggleGroupItem value="up" className="space-x-4" size="sm">
                {voteStatus === 1 ? <BiSolidUpvote size={16} /> : <BiUpvote size={16} />}
                <span className="mx-1">{formatNumber(baseCount + voteStatus)}</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="down" size="sm">
                {voteStatus === -1 ? <BiSolidDownvote size={16} /> : <BiDownvote size={16} />}
              </ToggleGroupItem>
            </ToggleGroup>
            <Button variant="ghost" size="sm">
              <BsChatSquare size={16} />
              <span className="ml-2">{formatNumber(_count.children)}</span>
            </Button>
            <Toggle
              size="sm"
              onPressedChange={(value) => {
                setBookmarkStatus(value)
                updateBookmark(id, user.id as string, value)
              }}
            >
              {bookmarkStatus ? <BsBookmarkFill size={16} /> : <BsBookmark size={16} />}
              <span className="ml-2">Bookmark</span>
            </Toggle>
          </div>
          <Button variant="secondary" onClick={() => setIsFormOpen(!isFormOpen)}>
            {isFormOpen ? 'Close' : 'Answer'}
          </Button>
        </CardFooter>
      </Card>
      {isFormOpen && (
        <AnswerForm title={title} parentId={id} communitySlug={community?.slug} mutate={mutate} setIsFormOpen={setIsFormOpen} />
      )}
      <Separator className="my-6" />
      {isPending && <PostCard {...optimisticAnswer(user, variables.title, variables.content)} />}
      {isSuccess &&
        data.pages.map((page) =>
          page.answers.map((post) => {
            if (page.answers.indexOf(post) === page.answers.length - 2) {
              return (
                <div key={post.id} ref={ref}>
                  <PostCard {...post} />
                </div>
              )
            } else {
              return <PostCard key={post.id} {...post} />
            }
          })
        )}
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
