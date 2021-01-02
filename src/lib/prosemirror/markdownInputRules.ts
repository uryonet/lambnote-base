import { ellipsis, emDash, InputRule, inputRules, smartQuotes, textblockTypeInputRule } from 'prosemirror-inputrules'
import { NodeType } from 'prosemirror-model'
import schema from './schema'

const headingRule = (nodeType: NodeType, maxLevel: number): InputRule => {
  return textblockTypeInputRule(new RegExp('^(#{1,' + maxLevel + '})\\s$'), nodeType, (match) => ({
    level: match[1].length
  }))
}

const markdownInputRules = () => {
  const rules = smartQuotes.concat(ellipsis, emDash)
  let type
  if ((type = schema.nodes.heading)) {
    rules.push(headingRule(type, 3))
  }
  return inputRules({ rules })
}

export default markdownInputRules
