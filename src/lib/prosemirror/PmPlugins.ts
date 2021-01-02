import { Plugin } from 'prosemirror-state'
import { undo, redo, history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
import { Schema } from 'prosemirror-model'
import markdownInputRules from './markdownInputRules'

export const pmPlugins = (schema: Schema): Plugin[] => {
  return [
    history(),
    keymap({ 'Mod-z': undo, 'Mod-y': redo }),
    keymap(baseKeymap),
    markdownInputRules(schema)
    // addClassPlugin
  ]
}
