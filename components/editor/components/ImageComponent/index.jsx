import Image from 'next/image'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents'

import * as React from 'react'
import { useEffect, useRef, useCallback } from 'react'
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_ENTER_COMMAND,
} from 'lexical'

export default function ImageComponent({
  src,
  altText,
  width,
  height,
  className,
  format,
  nodeKey,
}) {
  const [editor] = useLexicalComposerContext()
  const imageRef = useRef(null)
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)

  const onEnter = useCallback(
    (event) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const node = $getNodeByKey(nodeKey)
        node.selectNext()
      }
    },
    [isSelected, nodeKey]
  )

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const event = payload
          if (event.target === imageRef.current) {
            if (!event.shiftKey) {
              clearSelection()
            }
            setSelected(!isSelected)
            return true
          }
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW)
    )
  })

  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}
    >
      <Image src={src} alt={altText} width={width} height={height} />
    </BlockWithAlignableContents>
  )
}
