import * as graph from '@microsoft/microsoft-graph-client'
import * as authService from './AuthService'
import { AuthProviderCallback, Client } from '@microsoft/microsoft-graph-client'
import { Notebook, OnenotePage, OnenoteSection, User } from '@microsoft/microsoft-graph-types'
import { UpdateContent } from 'features/pages/pagesSlice'

class GraphService {
  private async getAuthClient(): Promise<Client> {
    const token = await authService.getToken()
    return graph.Client.init({
      authProvider: (done: AuthProviderCallback) => {
        done(null, token)
      }
    })
  }

  // ユーザー情報を取得する
  async getUserInfo(): Promise<User> {
    const client = await this.getAuthClient()
    return await client.api('/me').get()
  }

  // アバターアイコンを取得する
  async getUserAvatar(): Promise<string> {
    const client = await this.getAuthClient()
    const avatar = await client.api('/me/photo/$value').version('beta').get()
    return (window.URL || window.webkitURL).createObjectURL(avatar)
  }

  // LambNoteノートブックを取得する
  async getLambNotebook(): Promise<Notebook[]> {
    const client = await this.getAuthClient()
    const response = await client
      .api('/me/onenote/notebooks')
      .select('id,displayName')
      .filter("displayName eq 'LambNote'")
      .get()
    return response.value
  }

  // LambNoteノートブックを新規作成する
  async createLambNotebook(): Promise<Notebook> {
    const client = await this.getAuthClient()
    const json = { displayName: 'LambNote' }
    return await client.api('/me/onenote/notebooks').post(json)
  }

  // セクション一覧を取得する
  async getSectionsList(lambnoteId: string): Promise<OnenoteSection[]> {
    const client = await this.getAuthClient()
    const response = await client
      .api('/me/onenote/notebooks/' + lambnoteId + '/sections')
      .select('id,displayName,createdDateTime')
      .get()
    return response.value
  }

  // セクションを新規作成する
  async createNewSection(lambnoteId: string, sectionName: string): Promise<OnenoteSection> {
    const client = await this.getAuthClient()
    const json = { displayName: sectionName }
    return await client.api('/me/onenote/notebooks/' + lambnoteId + '/sections').post(json)
  }

  // セクションを削除する
  async deleteSection(sectionId: string) {
    const client = await this.getAuthClient()
    await client.api('/me/onenote/sections/' + sectionId).delete()
  }

  // ページ一覧を取得する
  async getPages(sectionId: string): Promise<OnenotePage[]> {
    const client = await this.getAuthClient()
    const response = await client
      .api('/me/onenote/sections/' + sectionId + '/pages')
      .select('id,createdDateTime,title')
      .orderby('title')
      .get()
    return response.value
  }

  // ページを取得する
  async getPage(pageId: string): Promise<string> {
    const client = await this.getAuthClient()
    const response: ReadableStream = await client.api('/me/onenote/pages/' + pageId + '/content').getStream()
    const reader = await response.getReader()
    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }
          controller.enqueue(value)
        }
        controller.close()
        reader.releaseLock()
      }
    })
    return await new Response(stream).text()
  }

  // ページタイトルを更新する
  async updatePageTitle(pageId: string, stream: UpdateContent[]): Promise<boolean> {
    const client = await this.getAuthClient()
    const response = await client.api('/me/onenote/pages/' + pageId + '/content').patch(JSON.stringify(stream))
    console.log(response)
    return response
  }

  // ページを新規作成する
  async createNewPage(sectionId: string, pageName: string): Promise<OnenotePage> {
    const client = await this.getAuthClient()
    const html =
      '<!DOCTYPE html>' +
      '<html lang="ja-JP"><head>' +
      '<title>' +
      pageName +
      '</title>' +
      '</head>' +
      '<body></body></html>'
    const response = await client
      .api('/me/onenote/sections/' + sectionId + '/pages')
      .header('Content-Type', 'application/xhtml+xml')
      .post(html)
    console.log(response)
    return response
  }
}

const graphService = new GraphService()

export default graphService
