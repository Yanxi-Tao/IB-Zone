import { Bell, CircleUser, Users, Plus, LayoutDashboard } from 'lucide-react'

export const sidebarNavs = [
  { icon: LayoutDashboard, route: '/', label: 'Explore' },
  {
    icon: Bell,
    route: '/notifications',
    label: 'Notifications',
  },
  {
    icon: Plus,
    route: '/create',
    label: 'Create',
  },
  {
    icon: Users,
    route: '/communities',
    label: 'Communities',
  },
  {
    icon: CircleUser,
    route: '/profile',
    label: 'Profile',
  },
]

export const userProfileNavs = [
  { label: 'Activities', value: 'activities' },
  { label: 'Questions', value: 'questions' },
  { label: 'Answers', value: 'answers' },
  { label: 'Articles', value: 'articles' },
  { label: 'Bookmarks', value: 'bookmarks' },
  { label: 'Follows', value: 'follows' },
  { label: 'Communities', value: 'communities' },
]

export const createFeedTypes = [
  { label: 'Question', value: 'question' },
  { label: 'Article', value: 'article' },
  { label: 'Answer', value: 'answer' },
]

export const ANSWERS_FETCH_SPAN = 5
export const POST_FETCH_SPAN = 5
export const COMMUNITY_FETCH_SPAN = 5
export const NOTIFICATION_FETCH_SPAN = 5

// tanstack queryKeys
export const QUESTION_ANSWERS_KEY = 'question-answers'
export const EXPLORE_POSTS_KEY = 'explore-posts'
export const COMMENT_KEY = 'comments'
export const COMMUNITY_KEY = 'communities-browse'
export const COMMUNITY_DISPLAY_KEY = 'community-display'
export const MY_ANSWER_KEY = 'my-answer'
export const REDIRECT_ANSWER_KEY = 'redirect-answer'
export const NOTIFICATION_COUNT_KEY = 'notification-count'
export const NOTIFICATION_KEY = 'notifications'

export const DELETED_CONTENT = '[deleted-content]'
export const DELETED_USER = '[deleted-user]'

export const reportOptions = [
  {
    id: 'spam',
    label: 'Spam or Advertisement',
  },
  {
    id: 'hate',
    label: 'Hate Speech or Offensive Language',
  },
  {
    id: 'violence',
    label: 'Violence or Harmful Behavior',
  },
  {
    id: 'inappropriate',
    label: 'Inappropriate Content',
  },
  {
    id: 'misinformation',
    label: 'Misinformation or False Information',
  },
  {
    id: 'other',
    label: 'Other',
  },
]
