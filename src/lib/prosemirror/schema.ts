import { Schema } from 'prosemirror-model'
import OrderedMap from 'orderedmap'
import nodeSpecs from './nodespec/nodeSpecs'
import { MarkSpec } from 'react-app-env'

export const marks: OrderedMap<MarkSpec> = OrderedMap.from({
  em: {
    parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
    toDOM() {
      return ['em', 0]
    }
  },
  strong: {
    parseDOM: [
      { tag: 'strong' },
      { tag: 'b', getAttrs: (node: any) => node.style.fontWeight != 'normal' && null },
      { style: 'font-weight', getAttrs: (value: any) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null }
    ],
    toDOM() {
      return ['strong', 0]
    }
  },
  code: {
    parseDOM: [{ tag: 'code' }],
    toDOM() {
      return ['code', 0]
    }
  }
})

const schema = new Schema({
  nodes: nodeSpecs,
  // @ts-ignore
  marks: marks
})

export default schema
