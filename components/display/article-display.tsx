'use client'

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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
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
import { useMemo, useState } from 'react'
import { QuestionDisplayProps } from '@/lib/types'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { AvatarCard } from '@/components/card/avatar-card'
import { deletePost } from '@/actions/post/delete-post'
import { useUpdateVote } from '@/hooks/useUpdateVote'
import { CommentDisplay } from '@/components/display/comment-display'
import { useUpdateBookmark } from '@/hooks/useUpdateBookmark'

export default function ArticleDisplay({
  id,
  title,
  content,
  author,
  community,
  updatedAt,
  bookmarks,
  upVotes,
  downVotes,
  comments,
}: QuestionDisplayProps) {
  const user = useCurrentUser()
  const updateVote = useUpdateVote('post')
  const updateBookmark = useUpdateBookmark()
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

  const commentCount = useMemo(
    () =>
      comments.length > 0
        ? comments.reduce((acc, comment) => acc + comment._count.children, 0) +
          comments.length
        : 0,
    [comments]
  )

  if (!user || !user.name || !user.email || !user.id) {
    return null
  }

  return (
    <div>
      <Card className="border-0 shadow-none">
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <div className="text-sm">
              {community && (
                <>
                  <Link href={`/community/${community.slug}`}>
                    <AvatarCard
                      source={null}
                      name={community.name}
                      className="w-7 h-7 text-sm"
                    />
                  </Link>
                  <Link
                    href={`/community/${community.slug}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    <span>{community.name}</span>
                  </Link>
                  <span>/</span>
                </>
              )}
              {author ? (
                <>
                  <Link href={`/profile/${author.slug}`}>
                    <AvatarCard
                      source={author.image}
                      name={author.name}
                      className="w-7 h-7 text-sm"
                    />
                  </Link>
                  <Link
                    href={`/profile/${author.slug}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    <span>{author.name}</span>
                  </Link>
                </>
              ) : (
                <>
                  <AvatarCard source={null} name="Deleted user" />
                  <span>Deleted user</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs">
                {new Date(updatedAt).toDateString()}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <HiDotsHorizontal size={20} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <HiFlag size={16} className="mr-2" />
                    Report
                  </DropdownMenuItem>
                  {user?.id === author?.id && (
                    <>
                      <DropdownMenuItem>
                        <FiEdit size={16} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => deletePost(id, 'article')}
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
          <CardTitle className=" leading-normal">{title}</CardTitle>
        </CardHeader>
        <CardContent className="max-w-[820px] break-words">
          <div
            className="editor w-full"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </CardContent>
        <Collapsible>
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
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <BsChatSquare size={16} />
                  <span className="ml-2">{formatNumber(commentCount)}</span>
                </Button>
              </CollapsibleTrigger>
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
          </CardFooter>
          <CollapsibleContent className="bg-background hover:bg-background pt-2">
            <CommentDisplay postId={id} />
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  )
}
