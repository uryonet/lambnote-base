import { Keymap } from 'prosemirror-commands'
import { undo, redo } from 'prosemirror-history'
import { splitListItem } from 'prosemirror-schema-list'
import schema from './schema'

export const keyMaps = (): Keymap => {
  let keys: Keymap = {}
  keys['Mod-z'] = undo
  keys['Mod-y'] = redo
  keys['Enter'] = splitListItem(schema.nodes.list_item)

  return keys
}
