import katex from 'katex'
import * as React from 'react'
import { useEffect, useRef, forwardRef } from 'react'
import { cn } from '@/lib/utils'

// katex renderer component
const KatexRenderer = forwardRef(function RenderContent(
  { equation, inline, className, ...props },
  ref
) {
  const katexElementRef = useRef(null)

  // update render content
  useEffect(() => {
    const katexElement = katexElementRef.current

    if (katexElement !== null) {
      katex.render(equation, katexElement, {
        displayMode: !inline,
        errorColor: '#cc0000',
        strict: 'warn',
        output: 'html',
        throwOnError: false,
        trust: false,
      })
    }
  }, [equation, inline])

  return (
    <>
      <img src="#" alt="" />
      <div {...props} ref={ref} className="inline-block">
        <span ref={katexElementRef} className={cn('mx-1', className)} />
      </div>
      <img src="#" alt="" />
    </>
  )
})

export default KatexRenderer
// export default function KatexRenderer({ equation, inline, className }) {
//   const katexElementRef = useRef(null)

//   // update render content
//   useEffect(() => {
//     const katexElement = katexElementRef.current

//     if (katexElement !== null) {
//       katex.render(equation, katexElement, {
//         displayMode: !inline,
//         errorColor: '#cc0000',
//         strict: 'warn',
//         throwOnError: false,
//         trust: false,
//       })
//     }
//   }, [equation, inline])

//   return (
//     <>
//       <span ref={katexElementRef} className={cn('mx-1', className)} />
//     </>
//   )
// }
