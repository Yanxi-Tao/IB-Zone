import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { LinkNode, AutoLinkNode } from '@lexical/link'

import { EquationNode } from './EquationNode'

const EditorNodes = [
  HeadingNode,
  QuoteNode,
  ListItemNode,
  ListNode,
  CodeHighlightNode,
  CodeNode,
  TableCellNode,
  TableNode,
  TableRowNode,
  EquationNode,
  LinkNode,
  AutoLinkNode,
]

export default EditorNodes