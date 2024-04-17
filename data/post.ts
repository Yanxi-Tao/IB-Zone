import { db } from '@/db/client'
import { PostType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const getDefaultQuestionsOrArticles = async ({
  communitySlug,
  offset,
  take,
}: {
  communitySlug: string | undefined
  offset: number
  take: number
}) => {
  try {
    const posts = await db.post.findMany({
      where: {
        community: {
          slug: communitySlug,
        },
        type: {
          in: ['question', 'article'],
        },
      },
      take,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            children: true,
          },
        },
        bookmarks: true,
        upVotes: true,
        downVotes: true,
        author: true,
        community: true,
        comments: {
          select: {
            _count: {
              select: {
                children: true,
              },
            },
          },
        },
      },
    })
    return posts
  } catch {
    return []
  }
}

export const getSearchedQuestionsOrArticles = async ({
  search,
  communitySlug,
  offset,
  take,
}: {
  search: string
  communitySlug: string | undefined
  offset: number
  take: number
}) => {
  try {
    const posts = await db.post.findMany({
      where: {
        community: {
          slug: communitySlug,
        },
        type: {
          in: ['question', 'article'],
        },
        OR: [
          {
            title: {
              search: search.split(' ').join(' | '),
              mode: 'insensitive',
            },
          },
          {
            content: {
              search: search.split(' ').join(' | '),
              mode: 'insensitive',
            },
          },
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
      take,
      skip: offset,
      orderBy: {
        _relevance: {
          fields: ['title', 'content'],
          search: search.split(' ').join(' | '),
          sort: 'desc',
        },
      },
      include: {
        _count: {
          select: {
            children: true,
          },
        },
        bookmarks: true,
        upVotes: true,
        downVotes: true,
        author: true,
        community: true,
        comments: {
          select: {
            _count: {
              select: {
                children: true,
              },
            },
          },
        },
      },
    })
    return posts
  } catch {
    return []
  }
}

export const getPostById = async (id: string) => {
  try {
    const post = await db.post.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            children: true,
          },
        },
        bookmarks: true,
        upVotes: true,
        downVotes: true,
        author: true,
        community: true,
        comments: {
          select: {
            _count: {
              select: {
                children: true,
              },
            },
          },
        },
      },
    })
    return post
  } catch {
    return null
  }
}

export const getAnsewrs = async ({
  parentId,
  offset,
  take,
}: {
  parentId: string
  offset: number
  take: number
}) => {
  try {
    const answers = await db.post.findMany({
      where: {
        parentId,
        type: 'answer',
      },
      take,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        bookmarks: true,
        upVotes: true,
        downVotes: true,
        community: true,
        author: true,
        comments: {
          select: {
            _count: {
              select: {
                children: true,
              },
            },
          },
        },
        _count: {
          select: {
            children: true,
          },
        },
      },
    })
    return answers
  } catch {
    return []
  }
}

export const deletePostById = async (id: string, type: PostType) => {
  // todo - cascade delete
  if (type === 'question') {
    try {
      await db.post.update({
        where: {
          id,
        },
        data: {
          author: {
            disconnect: true,
          },
        },
        include: {
          author: true,
        },
      })
      revalidatePath('/profile')
      return true
    } catch {
      return false
    }
  }
  try {
    await db.post.delete({
      where: {
        id,
      },
    })
    revalidatePath('/profile')
    return true
  } catch {
    return false
  }
}
