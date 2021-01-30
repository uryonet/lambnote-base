import { NodeSpec } from 'prosemirror-model'
import OrderedMap from 'orderedmap'
import TableNodeSpecs from '../TableNodeSpecs'

// @ts-ignore
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
      return ['pre', ['code', 0]]
    }
  },
  hard_break: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM() {
      return ['br']
    }
  },
  ordered_list: {
    attrs: { order: { default: 1 } },
    group: 'block',
    content: 'list_item+',
    parseDOM: [
      {
        tag: 'ol',
        getAttrs(dom: HTMLElement) {
          return { order: dom.hasAttribute('start') ? dom.getAttribute('start') : 1 }
        }
      }
    ],
    toDOM(node) {
      return node.attrs.order == 1 ? ['ol', 0] : ['ol', { start: node.attrs.order }, 0]
    }
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
    content: 'paragraph block*',
    defining: true,
    parseDOM: [{ tag: 'li' }],
    toDOM() {
      return ['li', 0]
    }
  }
})

// @ts-ignore
const nodeSpecs = nodes.append(TableNodeSpecs)

export default nodeSpecs
