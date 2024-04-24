'use client'

import dynamic from 'next/dynamic'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  BiSolidDownvote,
  BiUpvote,
  BiSolidUpvote,
  BiDownvote,
} from 'react-icons/bi'
import { HiDotsHorizontal } from 'react-icons/hi'
import { HiFlag } from 'react-icons/hi2'
import { FiEdit } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'
import { BsChatSquare, BsBookmark, BsBookmarkFill } from 'react-icons/bs'
import { formatNumber } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { PostDisplayProps } from '@/lib/types'
import {
  ANSWERS_FETCH_SPAN,
  DELETED_USER,
  MY_ANSWER_KEY,
  REDIRECT_ANSWER_KEY,
} from '@/lib/constants'
import { useInView } from 'react-intersection-observer'
import { PostCard } from '@/components/card/post-card'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useInfiniteAnswers } from '@/hooks/post'
import { BeatLoader } from 'react-spinners'
import { Separator } from '@/components/ui/separator'
import { AvatarCard } from '@/components/card/avatar-card'
import { deletePost } from '@/actions/post/delete-post'
import { useUpdateVote, useUpdateBookmark } from '@/hooks/post'
import PulseLoader from 'react-spinners/PulseLoader'
import { usePathname, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { fetchAnswer, fetchPostById } from '@/actions/post/fetch-post'
import { useRouter } from 'next-nprogress-bar'

const QuestionForm = dynamic(
  () => import('@/components/form/post-form').then((mod) => mod.QuestionForm),
  {
    loading: () => (
      <div className="flex justify-center my-10">
        <PulseLoader color="#8585ad" />
      </div>
    ),
  }
)

const AnswerForm = dynamic(
  () => import('@/components/form/post-form').then((mod) => mod.AnswerForm),
  {
    loading: () => (
      <div className="flex justify-center my-10">
        <PulseLoader color="#8585ad" />
      </div>
    ),
  }
)

export default function QuestionDisplay({
  post: {
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
  },
  redirectAnswerId,
}: PostDisplayProps) {
  const pathname = usePathname()
  const isEdit = useSearchParams().get('edit') === 'true' ? true : false
  const router = useRouter()
  const user = useCurrentUser()
  const updateBookmark = useUpdateBookmark()
  const updateVote = useUpdateVote('post')
  const { ref, inView } = useInView()
  const {
    data,
    isSuccess,
    isFetching,
    fetchStatus,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteAnswers({
    parentId: id,
    offset: 0,
    take: ANSWERS_FETCH_SPAN,
  })

  const { data: redirectAnswer } = useQuery({
    queryKey: [REDIRECT_ANSWER_KEY],
    queryFn: () => fetchPostById(redirectAnswerId),
    gcTime: Infinity,
    staleTime: Infinity,
    enabled: !!redirectAnswerId,
  })

  const { data: myAnswer } = useQuery({
    queryKey: [MY_ANSWER_KEY],
    queryFn: () => fetchAnswer(user?.id, id),
    gcTime: Infinity,
    staleTime: Infinity,
  })
  const userVoteStatus = useMemo(
    () =>
      upVotes.find((vote) => vote.id === user?.id)
        ? 1
        : downVotes.find((vote) => vote.id === user?.id)
        ? -1
        : 0,
    [upVotes, downVotes, user]
  )
  const userBookmarkStatus = useMemo(
    () =>
      bookmarks.find((bookmark) => bookmark.id === user?.id) ? true : false,
    [bookmarks, user]
  )
  const baseCount = upVotes.length - downVotes.length - userVoteStatus
  const [voteStatus, setVoteStatus] = useState(userVoteStatus)
  const [bookmarkStatus, setBookmarkStatus] = useState(userBookmarkStatus)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    if (!isFetching && inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage, isFetching])

  if (!user) {
    return null
  }

  return (
    <div>
      {!isEdit ? (
        <Card className="border-0 shadow-none">
          <CardHeader className="max-w-[820px] break-words">
            <div className="flex flex-row justify-between items-center">
              <div className="flex items-center space-x-2 text-sm">
                {community && (
                  <>
                    <Link
                      href={`/community/${community.slug}`}
                      className="flex items-center space-x-2"
                    >
                      <AvatarCard
                        source={null}
                        name={community.name}
                        className="w-7 h-7 text-sm"
                      />
                      <span className="text-primary underline-offset-4 hover:underline">
                        {community.name}
                      </span>
                    </Link>
                    <span>/</span>
                  </>
                )}
                {author ? (
                  <Link
                    href={`/profile/${author.slug}`}
                    className="flex items-center space-x-2"
                  >
                    <AvatarCard
                      source={author.image}
                      name={author.name}
                      className="w-7 h-7 text-sm"
                    />
                    <span className="text-primary underline-offset-4 hover:underline">
                      {author.name}
                    </span>
                  </Link>
                ) : (
                  <>
                    <AvatarCard
                      source={null}
                      name={DELETED_USER}
                      isDeleted
                      className="w-7 h-7 text-sm"
                    />
                    <span>{DELETED_USER}</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs">
                  {new Date(updatedAt).toDateString()}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <HiDotsHorizontal size={20} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <HiFlag size={16} className="mr-2" />
                      Report
                    </DropdownMenuItem>
                    {user?.id === author?.id && (
                      <>
                        <DropdownMenuItem
                          onSelect={() => router.push(`${pathname}?edit=true`)}
                        >
                          <FiEdit size={16} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => deletePost(id, 'question')}
                        >
                          <MdDelete size={16} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardTitle className="leading-normal">{title}</CardTitle>
          </CardHeader>
          <CardContent className="max-w-[820px] break-words">
            <div
              className="editor w-full"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
          <CardFooter className="py-0 pb-4 flex justify-between">
            <div className="flex items-center space-x-4">
              <ToggleGroup
                type="single"
                onValueChange={(value) => {
                  const voteValue =
                    value === 'up' ? 1 : value === 'down' ? -1 : 0
                  setVoteStatus(voteValue)
                  updateVote(id, user.id as string, voteValue)
                }}
                className=" bg-muted/50 rounded-lg"
              >
                <ToggleGroupItem value="up" className="space-x-4" size="sm">
                  {voteStatus === 1 ? (
                    <BiSolidUpvote size={16} />
                  ) : (
                    <BiUpvote size={16} />
                  )}
                  <span className="mx-1">
                    {formatNumber(baseCount + voteStatus)}
                  </span>
                </ToggleGroupItem>
                <ToggleGroupItem value="down" size="sm">
                  {voteStatus === -1 ? (
                    <BiSolidDownvote size={16} />
                  ) : (
                    <BiDownvote size={16} />
                  )}
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
                {bookmarkStatus ? (
                  <BsBookmarkFill size={16} />
                ) : (
                  <BsBookmark size={16} />
                )}
                <span className="ml-2">Bookmark</span>
              </Toggle>
            </div>
            {!isFormOpen && (
              <Button
                variant="secondary"
                onClick={() => setIsFormOpen(!isFormOpen)}
              >
                {`${myAnswer ? 'Edit Answer' : 'Answer'}`}
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <QuestionForm
          communitySlug={community?.slug}
          postId={id}
          initialContent={content}
          initialTitle={title}
          action="update"
          pathname={pathname}
        />
      )}
      {isFormOpen && (
        <AnswerForm
          postId={myAnswer?.id}
          initialTitle={title}
          initialContent={myAnswer?.content}
          parentId={id}
          communitySlug={community?.slug}
          setIsFormOpen={setIsFormOpen}
          action={myAnswer ? 'update' : 'create'}
          pathname={pathname}
          parentUserId={author?.id}
        />
      )}
      <Separator className="my-6" />
      {redirectAnswer && !isFormOpen && <PostCard {...redirectAnswer} />}
      {myAnswer && !isFormOpen && <PostCard {...myAnswer} />}
      {isSuccess &&
        data.pages.map((page) =>
          page.answers.map((post) => {
            if (post.id === myAnswer?.id || post.id === redirectAnswerId) {
              return null
            }
            if (
              page.answers.indexOf(post) ===
              (page.answers.length < 2
                ? page.answers.length - 1
                : page.answers.length - 2)
            ) {
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
      {!hasNextPage && fetchStatus !== 'fetching' && (
        <div className="flex items-center h-10 my-4 px-20">
          <div className="w-full border-b-2" />
        </div>
      )}
    </div>
  )
}
