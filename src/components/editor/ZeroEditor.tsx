import React, { useEffect, useRef, useState } from 'react'
import { mySchema } from '../../lib/prosemirror/MySchema'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { DOMParser } from 'prosemirror-model'
import { pmPlugins } from '../../lib/prosemirror/PmPlugins'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectPageContent,
  UpdateContent,
  updatePageTitle
} from '../../store/NoteSlice'
import { schema } from 'prosemirror-schema-basic'
import { PrimaryButton, TextField, ITextFieldStyles } from '@fluentui/react'
import { AppDispatch } from '../../store/store'
import graphService from '../../lib/GraphService'

export const ZeroEditor: React.FC = () => {
  const dispatch: AppDispatch = useDispatch()

  const { pageRaw, pageId, title } = useSelector(selectPageContent)
  const [pageTitle, setPageTitle] = useState('')

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
    console.log(pageRaw)
    if (renderFlgRef.current) {
      console.log('editorStateの更新')
      // const doc = DOMParser.fromSchema(mySchema()).parse(body)
      // const editorState = EditorState.create({
      //   doc,
      //   plugins: pmPlugins()
      // })
      // eView.current?.updateState(editorState)
      setPageTitle(title)
    } else {
      renderFlgRef.current = true
    }
  }, [pageRaw])

  const patchPageTitle = () => {
    dispatch(updatePageTitle(pageId, pageTitle))
  }

  const handleChange = (e: any, value: string | undefined) => {
    value ? setPageTitle(value) : setPageTitle('')
  }

  return (
    <div className="zero-editor">
      <PrimaryButton text="保存" onClick={patchPageTitle} />
      <TextField
        className="title-editor"
        underlined
        value={pageTitle}
        onChange={handleChange}
        styles={getTitleFormStyles()}
      />
      <div className="editor" ref={pmEditor} />
    </div>
  )
}

//スタイル
const getTitleFormStyles = (): Partial<ITextFieldStyles> => {
  return {
    fieldGroup: [{ height: 46 }],
    field: [{ 'font-size': 32 }]
  }
}
