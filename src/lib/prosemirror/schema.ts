import { DOMOutputSpec, MarkSpec, Node, NodeSpec, Schema } from 'prosemirror-model'
import OrderedMap from 'orderedmap'

const preDOM: DOMOutputSpec = ['pre', ['code', 0]]
const brDOM: DOMOutputSpec = ['br']
const olDOM: DOMOutputSpec = ['ol', 0]

const nodes: OrderedMap<NodeSpec> = OrderedMap.from({
  doc: {
    content: 'block+'
  },
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return ['p', 0]
    }
  },
  heading: {
    content: 'inline*',
    group: 'block',
    attrs: { level: { default: 1 } },
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
  text: {
    group: 'inline'
  },
  code_block: {
    content: 'inline*',
    group: 'block',
    marks: '_',
    code: true,
    defining: true,
    parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
    toDOM() {
      return preDOM
    }
  },
  hard_break: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM() {
      return brDOM
    }
  },
  ordered_list: {
    group: 'block',
    content: 'list_item+',
    // attrs: {
    //   order: { default: 1 }
    // },
    // parseDOM: [
    //   {
    //     tag: 'ol',
    //     getAttrs(dom: HTMLElement) {
    //       return { order: dom.hasAttribute('start') ? dom.getAttribute('start') : 1 }
    //     }
    //   }
    // ],
    // toDOM(node: Node) {
    //   return node.attrs.order == 1 ? olDOM : ['ol', { start: node.attrs.order }, 0]
    // }
  },
  bullet_list: {
    group: 'block',
    content: 'list_item+',
    parseDOM: [{ tag: 'ul' }],
    toDOM() {
      return ['ul', 0]
    }
  },
  list_item: {
    content: 'paragraph',
    defining: true,
    parseDOM: [{ tag: 'li' }],
    toDOM() {
      return ['li', 0]
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
