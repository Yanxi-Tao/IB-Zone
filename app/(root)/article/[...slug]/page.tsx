import { fetchPostById } from '@/actions/post/fetch-post'
import ArticleDisplay from '@/components/display/article-display'

export default async function ArticleDisplayPage({
  params,
}: {
  params: { slug: string[] }
}) {
  const post = await fetchPostById(params.slug[0])
  if (!post) return <div>Not logged in</div>

  return <ArticleDisplay post={post} />
}