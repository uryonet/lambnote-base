import { Plugin } from 'prosemirror-state'
import { history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { keyMaps } from './keyMaps'
import { baseKeymap } from 'prosemirror-commands'
import { Schema } from 'prosemirror-model'
import markdownInputRules from './markdownInputRules'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'

export const pmPlugins = (schema: Schema): Plugin[] => {
  return [history(), keymap(keyMaps()), keymap(baseKeymap), markdownInputRules(schema), dropCursor(), gapCursor()]
}
