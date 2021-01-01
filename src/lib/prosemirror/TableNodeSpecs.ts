import { tableNodes } from 'prosemirror-tables'

const TableNodeSpecs = tableNodes({
  tableGroup: 'block',
  cellContent: 'block+',
  cellAttributes: {
    borderColor: {
      default: null
    }
  }
})

const TableNodeSpec = Object.assign({}, TableNodeSpecs.table, {
  parseDOM: [
    {
      tag: 'table'
    }
  ],
  toDOM() {
    return ['table', 0]
  }
})

Object.assign(TableNodeSpecs, { table: TableNodeSpec })

export default TableNodeSpecs
