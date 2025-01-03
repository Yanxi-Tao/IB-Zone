'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { PostCardProps } from '@/lib/types'
import { calcVoteStatus, formatNumber } from '@/lib/utils'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  BiSolidDownvote,
  BiUpvote,
  BiSolidUpvote,
  BiDownvote,
} from 'react-icons/bi'
import { BsChatSquare, BsBookmark, BsBookmarkFill } from 'react-icons/bs'
import { MdOutlineClose } from 'react-icons/md'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { CommentDisplay } from '@/components/display/comment-display'
import { AvatarCard } from '@/components/card/avatar-card'
import { HiDotsHorizontal } from 'react-icons/hi'
import { HiFlag } from 'react-icons/hi2'
import { FiEdit } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'
import { useCurrentUser } from '@/hooks/user'
import { DELETED_USER } from '@/lib/constants'
import { useDeletePost } from '@/hooks/post'
import { useUpdateBookmark } from '@/hooks/post'
import { useUpdateVote } from '@/hooks/post'
import { ReportForm } from '@/components/form/report-form'

export const PostCard = ({
  post: {
    id,
    title,
    content,
    type,
    author,
    community,
    updatedAt,
    upVotes,
    downVotes,
    bookmarks,
    _count,
  },
  showCommunity,
}: PostCardProps) => {
  const updateVote = useUpdateVote('post')
  const updateBookmark = useUpdateBookmark()
  const mutate = useDeletePost(id, type)

  const user = useCurrentUser()
  const userVoteStatus = useMemo(
    () => calcVoteStatus({ upVotes, downVotes, userId: user?.id }),
    [upVotes, downVotes, user]
  )
  const userBookmarkStatus = useMemo(
    () => bookmarks.some((bookmark) => bookmark.id === user?.id),
    [bookmarks, user?.id]
  )
  const baseCount = upVotes.length - downVotes.length - userVoteStatus
  const [voteStatus, setVoteStatus] = useState(userVoteStatus)
  const [bookmarkStatus, setBookmarkStatus] = useState(userBookmarkStatus)
  const shouldCollapse = useMemo(() => content.length > 500, [content])
  const [isCollapsed, setIsCollapsed] = useState(true)

  const redirectTo = community
    ? `/community/${community.slug}/${type}/${id}`
    : `/${type}/${id}`

  return (
    <Card className="relative shadow-none border-0 border-b space-y-1 py-1 pt-2 max-w-[800px] break-words">
      <CardHeader className="py-0 space-y-0.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2 text-sm">
            {community && showCommunity ? (
              <Link
                href={`/community/${community.slug}`}
                className="flex items-center space-x-2"
              >
                <AvatarCard
                  source={community.image}
                  name={community.name}
                  className="w-7 h-7 text-sm"
                />
                <span className="text-primary underline-offset-4 hover:underline">
                  {`c/${community.name}`}
                </span>
              </Link>
            ) : author ? (
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
                  {`u/${author.name}`}
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
            <span className="text-muted-foreground">
              {new Date(updatedAt).toDateString()}
            </span>
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <HiDotsHorizontal size={20} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {user?.id && (
                    <DialogTrigger asChild>
                      <DropdownMenuItem>
                        <HiFlag size={16} className="mr-2" />
                        Report
                      </DropdownMenuItem>
                    </DialogTrigger>
                  )}
                  {user?.id === author?.id && (
                    <>
                      {type === 'question' || type === 'article' ? (
                        <DropdownMenuItem>
                          <Link
                            href={`${redirectTo}/?edit=true`}
                            className="flex"
                          >
                            <FiEdit size={16} className="mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuItem onSelect={() => mutate()}>
                        <MdDelete size={16} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report</DialogTitle>
                </DialogHeader>
                <ReportForm
                  postId={id}
                  reportUserId={user?.id as string}
                  type="post"
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {(type === 'question' || type === 'article') && (
          <Link href={redirectTo}>
            <CardTitle className="text-base line-clamp-2">{title}</CardTitle>
          </Link>
        )}
      </CardHeader>
      {type === 'question' || type === 'article' ? (
        <Link href={redirectTo}>
          <CardContent className="py-1.5 max-h-[200px] break-words overflow-hidden line-clamp-3">
            <div
              className="editor"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </CardContent>
        </Link>
      ) : (
        <CardContent
          className={`${
            isCollapsed && 'max-h-[200px] overflow-hidden'
          } py-1.5 break-words`}
        >
          <div
            className="editor"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </CardContent>
      )}
      {shouldCollapse && type === 'answer' && isCollapsed && (
        <div className="absolute bottom-[40px] h-[200px] flex w-full justify-center items-end py-1 bg-gradient-to-t from-background to-transparent">
          <Button
            variant="link"
            size="sm"
            onClick={() => setIsCollapsed(false)}
            className="bg-background w-full"
          >
            Read More
          </Button>
        </div>
      )}
      <Collapsible
        className={`${!isCollapsed && 'sticky bottom-0'} bg-background`}
      >
        <CardFooter className="w-full py-1 justify-between">
          <div className="flex space-x-4 items-center">
            <ToggleGroup
              type="single"
              onValueChange={(value) => {
                if (!user) return
                const voteValue = value === 'up' ? 1 : value === 'down' ? -1 : 0
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
            {type === 'question' || type === 'article' ? (
              <Link
                href={
                  community
                    ? `/community/${community.slug}/${type}/${id}`
                    : `/${type}/${id}`
                }
              >
                <Button variant="ghost" size="sm">
                  <BsChatSquare size={16} />
                  <span className="ml-2">
                    {formatNumber(
                      type === 'question' ? _count.children : _count.comments
                    )}
                  </span>
                </Button>
              </Link>
            ) : (
              <CollapsibleTrigger asChild>
                <Button variant="ghost">
                  <BsChatSquare size={16} />
                  <span className="ml-2">{formatNumber(_count.comments)}</span>
                </Button>
              </CollapsibleTrigger>
            )}
            <Toggle
              size="sm"
              onPressedChange={(value) => {
                if (!user) return
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
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(true)}
            >
              <span className="mr-2">Close</span>
              <MdOutlineClose size={16} />
            </Button>
          )}
        </CardFooter>
        <CollapsibleContent className="bg-background hover:bg-background pt-2">
          <CommentDisplay postId={id} />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
