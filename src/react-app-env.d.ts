/// <reference types="react-scripts" />
export type MarkSpec = {
  attrs?:
    | {
        [key: string]: any
      }
    | null
    | undefined
  name?: string | null | undefined
  inline?: boolean | null | undefined
  group?: string
  defining?: boolean
  draggable?: boolean
  inclusive?: boolean
  spanning?: boolean
  excludes?: string
  parseDOM: Array<any>
  toDOM: (node: any) => Array<any>
}
