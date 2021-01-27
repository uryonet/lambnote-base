import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectPage, updatePageData } from 'features/pages/pageSlice'

import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { DOMParser, DOMSerializer, Node as ProsemirrorNode } from 'prosemirror-model'
import schema from 'lib/prosemirror/schema'
import { pmPlugins } from '../../lib/prosemirror/PmPlugins'
import applyDevTools from 'prosemirror-dev-tools'

import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

export const Editor: React.FC = () => {
  const dispatch = useDispatch()
  const [pageTitle, setPageTitle] = useState('')
  const { isLoading, currentPageId, currentPageTitle, currentPageBody, currentDivId } = useSelector(selectPage)

  const pmEditor = useRef<HTMLDivElement>(null)
  const eView = useRef<EditorView | null>(null)
  const renderFlgRef = useRef(false)

  const createEditorView = (element: HTMLDivElement | null) => {
    console.log('editorViewを作成します')
    if (element) {
      eView.current = new EditorView(element, {
        state: createEditorState(),
        dispatchTransaction(transaction) {
          let newState = this.state.apply(transaction)
          this.updateState(newState)
        }
      })
    }
  }

  const createEditorState = (value?: string): EditorState => {
    console.log('editorStateを作成します')
    const doc = createDocument(value)
    return EditorState.create({
      schema,
      doc,
      plugins: pmPlugins(schema)
    })
  }

  const createDocument = (content?: string): ProsemirrorNode<any> | null | undefined => {
    const tempEl = document.createElement('div')
    if (content) {
      tempEl.innerHTML = content
      if (tempEl.firstElementChild) {
        return DOMParser.fromSchema(schema).parse(tempEl.firstElementChild)
      }
    }
    return null
  }

  //初回レンダリング時のみ動作する
  useEffect(() => {
    createEditorView(pmEditor.current)
    if (eView.current) {
      applyDevTools(eView.current)
    }
    return () => eView.current?.destroy()
  }, [])

  //NoteContentIdが更新された場合のみ動作する
  useEffect(() => {
    setPageTitle(currentPageTitle)
  }, [currentPageId])

  //NoteContentBodyが更新された場合のみ動作する
  useEffect(() => {
    if (renderFlgRef.current) {
      console.log('editorStateの更新')
      const newState = createEditorState(currentPageBody)
      eView.current?.updateState(newState)
    } else {
      renderFlgRef.current = true
    }
  }, [currentPageBody])

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageTitle(event.target.value)
  }

  const handleUpdatePage = () => {
    const doc = eView.current?.state.doc.content
    if (doc) {
      const docHtml = DOMSerializer.fromSchema(schema).serializeFragment(doc)
      const container = document.createElement('article')
      container.appendChild(docHtml)
      dispatch(updatePageData(currentPageId, pageTitle, currentDivId, container.innerHTML))
    }
  }

  return (
    <div className="main-editor">
      <Button
        className="p-mb-3"
        label="保存"
        onClick={handleUpdatePage}
        icon={isLoading ? 'pi pi-spin pi-spinner' : ''}
      />
      <div className="p-fluid">
        <div className="p-field">
          <InputText value={pageTitle} onChange={handleTitleChange} />
        </div>
        <div className="p-field">
          <div ref={pmEditor} />
        </div>
      </div>
      <div className="editor-bottom p-d-md-none" />
    </div>
  )
}
