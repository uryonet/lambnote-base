import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectPages, updatePageContent, updatePageTitle } from 'features/pages/pagesSlice'

import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { DOMParser, DOMSerializer, Node as ProsemirrorNode } from 'prosemirror-model'
import schema from 'lib/prosemirror/schema'
import { pmPlugins } from '../../lib/prosemirror/PmPlugins'
import applyDevTools from 'prosemirror-dev-tools'

import { Button, Col, Form, Row } from 'react-bootstrap'

export const Editor: React.FC = () => {
  const dispatch = useDispatch()
  const [pageTitle, setPageTitle] = useState('')
  const { currentPageId, currentPageTitle, currentPageBody, currentDivId } = useSelector(selectPages)

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

  //NoteContentStateが更新された場合のみ動作する
  useEffect(() => {
    if (renderFlgRef.current) {
      console.log('editorStateの更新')
      const newState = createEditorState(currentPageBody)
      eView.current?.updateState(newState)
      setPageTitle(currentPageTitle)
    } else {
      renderFlgRef.current = true
    }
  }, [currentPageBody])

  const handleUpdateTitle = () => {
    dispatch(updatePageTitle(currentPageId, pageTitle))
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageTitle(event.target.value)
  }

  const handleUpdateContent = () => {
    const doc = eView.current?.state.doc.content
    if (doc) {
      const docHtml = DOMSerializer.fromSchema(schema).serializeFragment(doc)
      const container = document.createElement('article')
      container.appendChild(docHtml)
      console.log(container.innerHTML)
      dispatch(updatePageContent(currentPageId, currentDivId, container.innerHTML))
    }
  }

  return (
    <div className="main-editor">
      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            タイトル
          </Form.Label>
          <Col sm="7">
            <Form.Control className="mr-3" value={pageTitle} onChange={handleTitleChange} />
          </Col>
          <Col sm="3">
            <Button onClick={handleUpdateTitle}>タイトル保存</Button>
          </Col>
        </Form.Group>
      </Form>
      <h2>コンテンツ</h2>
      <Button onClick={handleUpdateContent}>コンテンツ保存</Button>
      <div className="editor" ref={pmEditor} />
    </div>
  )
}
