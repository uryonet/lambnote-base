import {
  ellipsis,
  emDash,
  InputRule,
  inputRules,
  smartQuotes,
  textblockTypeInputRule,
  wrappingInputRule
} from 'prosemirror-inputrules'
import { NodeType, Schema } from 'prosemirror-model'

const headingRule = (nodeType: NodeType, maxLevel: number): InputRule => {
  return textblockTypeInputRule(new RegExp('^(#{1,' + maxLevel + '})\\s$'), nodeType, (match) => ({
    level: match[1].length
  }))
}

const orderedListRule = (nodeType: NodeType): InputRule => {
  return wrappingInputRule(
    /^(\d+)\.\s$/,
    nodeType,
    (match) => ({ order: +match[1] }),
    (match, node) => node.childCount + node.attrs.order == +match[1]
  )
}

const bulletListRule = (nodeType: NodeType): InputRule => {
  return wrappingInputRule(/^\s*([-+*])\s$/, nodeType)
}

const codeBlockRule = (nodeType: NodeType): InputRule => {
  return textblockTypeInputRule(/^```$/, nodeType)
}

const markdownInputRules = (schema: Schema) => {
  const rules = smartQuotes.concat(ellipsis, emDash)
  let type
  if ((type = schema.nodes.heading)) {
    rules.push(headingRule(type, 3))
  }
  if ((type = schema.nodes.ordered_list)) {
    rules.push(orderedListRule(type))
  }
  if ((type = schema.nodes.bullet_list)) {
    rules.push(bulletListRule(type))
  }
  if ((type = schema.nodes.code_block)) {
    rules.push(codeBlockRule(type))
  }
  return inputRules({ rules })
}

export default markdownInputRules
