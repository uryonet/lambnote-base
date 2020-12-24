import { DOMOutputSpec, MarkSpec, NodeSpec, Schema } from 'prosemirror-model'
import OrderedMap from 'orderedmap'

const pDOM: DOMOutputSpec = ['p', 0]
const blockquoteDOM: DOMOutputSpec = ['blockquote', 0]
const hrDOM: DOMOutputSpec = ['hr']
const preDOM: DOMOutputSpec = ['pre', ['code', 0]]
const brDOM: DOMOutputSpec = ['br']

const nodes: OrderedMap<NodeSpec> = OrderedMap.from({
  doc: {
    content: 'block+'
  },
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return pDOM
    }
  },
  blockquote: {
    content: 'block+',
    group: 'block',
    defining: true,
    parseDOM: [{ tag: 'blockquote' }],
    toDOM() {
      return blockquoteDOM
    }
  },
  horizontal_rule: {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM() {
      return hrDOM
    }
  },
  heading: {
    attrs: { level: { default: 1 } },
    content: 'inline*',
    group: 'block',
    defining: true,
    parseDOM: [
      { tag: 'h1', attrs: { level: 1 } },
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
      { tag: 'h4', attrs: { level: 4 } },
      { tag: 'h5', attrs: { level: 5 } },
      { tag: 'h6', attrs: { level: 6 } }
    ],
    toDOM(node) {
      return ['h' + node.attrs.level, 0]
    }
  },
  code_block: {
    content: 'text*',
    marks: '',
    group: 'block',
    code: true,
    defining: true,
    parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
    toDOM() {
      return preDOM
    }
  },
  text: {
    group: 'inline'
  },
  hard_break: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM() {
      return brDOM
    }
  }
})

const emDOM: DOMOutputSpec = ['em', 0],
  codeDOM: DOMOutputSpec = ['code', 0]

export const marks: OrderedMap<MarkSpec> = OrderedMap.from({
  em: {
    parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
    toDOM() {
      return emDOM
    }
  },
  code: {
    parseDOM: [{ tag: 'code' }],
    toDOM() {
      return codeDOM
    }
  }
})

const schema = new Schema({
  nodes: nodes,
  marks: marks
})

export default schema
