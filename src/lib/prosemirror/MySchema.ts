import { Schema } from 'prosemirror-model'
import { tableNodes } from 'prosemirror-tables'
import { addListNodes } from 'prosemirror-schema-list'

// export const mySchema = (): Schema => {
//   let mySchema: Schema

  // const tNodes = tableNodes({
  //   tableGroup: 'block',
  //   cellContent: 'block+',
  //   cellAttributes: {
  //     background: {
  //       default: null,
  //       getFromDOM(dom: any) {
  //         return dom.style.backgroundColor || null
  //       },
  //       setDOMAttr(value: any, attrs: { style: string }) {
  //         if (value) {
  //           attrs.style = (attrs.style || '') + `background-color: ${value};`
  //         }
  //       }
  //     }
  //   }
  // })

  // const tNodeSpec = Object.assign({}, tNodes.table, {
  //   toDOM() {
  //     return ['table', { class: 'table table-bordered' }, ['tbody', 0]]
  //   }
  // })

  // Object.assign(tNodes, { table: tNodeSpec })

  // if ('append' in schema.spec.nodes) {
  //   const addedNodes = addListNodes(
  //     schema.spec.nodes.append(tNodes),
  //     `paragraph block*`,
  //     'block'
  //   )
  //   mySchema = new Schema({
  //     nodes: addListNodes(
  //       schema.spec.nodes.append(tNodes),
  //       'paragraph block*',
  //       'block'
  //     ),
  //     marks: schema.spec.marks
  //   })
  // } else {
  //   mySchema = schema
  // }

  // return mySchema
// }
