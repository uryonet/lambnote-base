import { Plugin, PluginKey } from 'prosemirror-state'
import { undo, redo, history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
import markdownInputRules from './markdownInputRules'

export const pmPlugins = (): Plugin[] => {
  const addClassPlugin = new Plugin({
    props: {
      attributes: { class: 'zeronote-editor' }
    }
  })

  return [
    history(),
    keymap({ 'Mod-z': undo, 'Mod-y': redo }),
    keymap(baseKeymap),
    setPluginKey(markdownInputRules(), 'InputRules')
    // addClassPlugin
  ]
}

const setPluginKey = (plugin: any, key: string) => {
  plugin.spec.key = new PluginKey(key + 'Plugin')
  plugin.key = plugin.spec.key.key
  return plugin
}
