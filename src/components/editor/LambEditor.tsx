import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectPages, updatePageTitle } from 'features/pages/pagesSlice'

import graphService from 'lib/graph/GraphService'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { DOMParser } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { mySchema } from '../../lib/prosemirror/MySchema'
import { pmPlugins } from '../../lib/prosemirror/PmPlugins'

export const LambEditor: React.FC = () => {
  const dispatch = useDispatch()
  const [pageTitle, setPageTitle] = useState('')
  const { currentPageId, currentPageTitle, currentPageRaw } = useSelector(selectPages)

  const pmEditor = useRef<HTMLDivElement>(null)
  const eView = useRef<EditorView | null>(null)
  const renderFlgRef = useRef(false)

  const createEditorView = (element: HTMLDivElement | null) => {
    console.log('editorViewを作成します')
    if (element) {
      const eState = EditorState.create({
        schema,
        plugins: pmPlugins()
      })
      eView.current = new EditorView(element, {
        state: eState,
        dispatchTransaction(transaction) {
          let newState = this.state.apply(transaction)
          this.updateState(newState)
        }
      })
    }
  }

  //初回レンダリング時のみ動作する
  useEffect(() => {
    createEditorView(pmEditor.current)
    return () => eView.current?.destroy()
  }, [])

  //NoteContentStateが更新された場合のみ動作する
  useEffect(() => {
    console.log(currentPageRaw)
    if (renderFlgRef.current) {
      console.log('editorStateの更新')
      // const doc = DOMParser.fromSchema(mySchema()).parse(body)
      // const editorState = EditorState.create({
      //   doc,
      //   plugins: pmPlugins()
      // })
      // eView.current?.updateState(editorState)
      setPageTitle(currentPageTitle)
    } else {
      renderFlgRef.current = true
    }
  }, [currentPageRaw])

  return (
    <div className="lamb-editor">
      <div className="editor" ref={pmEditor} />
    </div>
  )
}
