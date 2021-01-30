import { DOMOutputSpec, MarkSpec, Schema } from 'prosemirror-model'
import OrderedMap from 'orderedmap'
import nodeSpecs from './nodespec/nodeSpecs'

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
  nodes: nodeSpecs,
  marks: marks
})

export default schema
