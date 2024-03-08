import * as React from 'react'
import { forwardRef } from 'react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

const FeedRoot = forwardRef(({ children, ...props }, ref) => {
  return (
    <Collapsible className="editor w-[750px]" {...props} ref={ref}>
      {children}
    </Collapsible>
  )
})

FeedRoot.displayName = 'FeedRoot'

const FeedPreview = forwardRef(({ children, title, ...props }, ref) => {
  return (
    <>
      <CollapsibleTrigger {...props} ref={ref}>
        {children}
      </CollapsibleTrigger>
    </>
  )
})

FeedPreview.displayName = 'FeedPreview'

const FeedContent = forwardRef(({ children, ...props }, ref) => {
  return <CollapsibleContent {...props}>{children}</CollapsibleContent>
})

FeedContent.displayName = 'FeedContent'

const FeedToolbar = forwardRef(({ ...props }, ref) => {
  return <div></div>
})

FeedToolbar.displayName = 'FeedToolbar'

export { FeedRoot, FeedPreview, FeedContent, FeedToolbar }
