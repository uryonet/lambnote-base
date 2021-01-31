import { chainCommands, exitCode, Keymap, setBlockType, toggleMark } from 'prosemirror-commands'
import { undo, redo } from 'prosemirror-history'
import { splitListItem } from 'prosemirror-schema-list'
import { undoInputRule } from 'prosemirror-inputrules'
import schema from './schema'

export const keyMaps = (): Keymap => {
  let keys: Keymap = {}
  keys['Mod-z'] = undo
  keys['Mod-y'] = redo
  keys['Backspace'] = undoInputRule

  keys['Mod-b'] = toggleMark(schema.marks.strong)
  keys['Mod-B'] = toggleMark(schema.marks.strong)
  keys['Mod-i'] = toggleMark(schema.marks.em)
  keys['Mod-I'] = toggleMark(schema.marks.em)
  keys['Mod-`'] = toggleMark(schema.marks.code)
  keys['Shift-Ctrl-0'] = setBlockType(schema.nodes.paragraph)
  keys['Shift-Ctrl-\\'] = setBlockType(schema.nodes.code_block)
  keys['Shift-Ctrl-1'] = setBlockType(schema.nodes.heading, { level: 1 })
  keys['Shift-Ctrl-2'] = setBlockType(schema.nodes.heading, { level: 2 })
  keys['Shift-Ctrl-3'] = setBlockType(schema.nodes.heading, { level: 3 })
  keys['Shift-Ctrl-4'] = setBlockType(schema.nodes.heading, { level: 4 })
  keys['Shift-Ctrl-5'] = setBlockType(schema.nodes.heading, { level: 5 })
  keys['Shift-Ctrl-6'] = setBlockType(schema.nodes.heading, { level: 6 })
  let cmd = chainCommands(exitCode, (state, dispatch) => {
    if (dispatch) {
      dispatch(state.tr.replaceSelectionWith(schema.nodes.hard_break.create()).scrollIntoView())
      return true
    }
    return false
  })
  keys['Mod-Enter'] = cmd
  keys['Shift-Enter'] = cmd
  keys['Ctrl-Enter'] = cmd

  keys['Enter'] = splitListItem(schema.nodes.list_item)

  return keys
}
