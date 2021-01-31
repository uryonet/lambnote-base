import { Keymap, toggleMark } from 'prosemirror-commands'
import { undo, redo } from 'prosemirror-history'
import { splitListItem } from 'prosemirror-schema-list'
import schema from './schema'

export const keyMaps = (): Keymap => {
  let keys: Keymap = {}
  keys['Mod-z'] = undo
  keys['Mod-y'] = redo
  keys['Mod-b'] = toggleMark(schema.marks.strong)
  keys['Mod-B'] = toggleMark(schema.marks.strong)
  keys['Mod-i'] = toggleMark(schema.marks.em)
  keys['Mod-I'] = toggleMark(schema.marks.em)
  keys['Enter'] = splitListItem(schema.nodes.list_item)

  return keys
}
