import { Plugin } from 'prosemirror-state'
import { undo, redo, history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'

export const pmPlugins = (): Plugin[] => {
  const addClassPlugin = new Plugin({
    props: {
      attributes: { class: 'zeronote-editor' }
    }
  })

  return [
    history(),
    keymap({ 'Mod-z': undo, 'Mod-y': redo }),
    keymap(baseKeymap)
    // addClassPlugin
  ]
}
