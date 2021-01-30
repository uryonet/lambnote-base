import { Plugin } from 'prosemirror-state'
import { history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { keyMaps } from './keyMaps'
import { baseKeymap } from 'prosemirror-commands'
import { Schema } from 'prosemirror-model'
import markdownInputRules from './markdownInputRules'

export const pmPlugins = (schema: Schema): Plugin[] => {
  return [
    history(),
    keymap(keyMaps()),
    keymap(baseKeymap),
    markdownInputRules(schema)
    // addClassPlugin
  ]
}
