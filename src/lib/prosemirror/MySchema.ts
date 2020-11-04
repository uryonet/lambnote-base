import { Schema } from 'prosemirror-model'
import { tableNodes } from 'prosemirror-tables'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'

export const mySchema = (): Schema => {
  let mySchema: Schema

  const tNodes = tableNodes({
    tableGroup: 'block',
    cellContent: 'block+',
    cellAttributes: {
      background: {
        default: null,
        getFromDOM(dom: any) {
          return dom.style.backgroundColor || null
        },
        setDOMAttr(value: any, attrs: { style: string }) {
          if (value) {
            attrs.style = (attrs.style || '') + `background-color: ${value};`
          }
        }
      }
    }
  })

  const tNodeSpec = Object.assign({}, tNodes.table, {
    toDOM() {
      return ['table', { class: 'table table-bordered' }, ['tbody', 0]]
    }
  })

  Object.assign(tNodes, { table: tNodeSpec })

  if ('append' in schema.spec.nodes) {
    mySchema = new Schema({
      // @ts-ignore
      nodes: addListNodes(
        // @ts-ignore
        schema.spec.nodes.append(tNodes),
        'paragraph block*',
        'block'
      ),
      // @ts-ignore
      marks: schema.spec.marks
    })
  } else {
    // @ts-ignore
    mySchema = schema
  }

  return mySchema
}
