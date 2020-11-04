import * as graph from '@microsoft/microsoft-graph-client'
import * as authService from './AuthService'
import { AuthProviderCallback, Client } from '@microsoft/microsoft-graph-client'
import { Notebook, OnenotePage, User } from '@microsoft/microsoft-graph-types'
import { UpdateContent } from '../../store/NoteSlice'

class GraphService {
  private async getAuthClient(): Promise<Client> {
    const token = await authService.getToken()
    return graph.Client.init({
      authProvider: (done: AuthProviderCallback) => {
        done(null, token)
      }
    })
  }

  async getUserInfo(): Promise<User> {
    const client = await this.getAuthClient()
    return await client.api('/me').get()
  }

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
      .filter('displayName eq \'LambNote\'')
      .get()
    return response.value
  }

  // LambNoteノートブックを新規作成する
  async createLambNotebook(): Promise<Notebook> {
    const client = await this.getAuthClient()
    const json = {"displayName":"LambNote"}
    return await client
      .api('/me/onenote/notebooks')
      .post(json)
  }

  async getPages(sectionId: string): Promise<OnenotePage[]> {
    const client = await this.getAuthClient()
    const response = await client
      .api('/me/onenote/sections/' + sectionId + '/pages')
      .select('id,createdDateTime,title')
      .orderby('title')
      .get()
    return response.value
  }

  async getPageContent(pageId: string): Promise<string> {
    const client = await this.getAuthClient()
    const response: ReadableStream = await client
      .api('/me/onenote/pages/' + pageId + '/content')
      .getStream()
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

  async updatePageTitle(pageId: string, stream: UpdateContent[]): Promise<boolean> {
    // const json = JSON.stringify(stream)
    const json = [
      {
        'target': 'title',
        'action': 'replace',
        'content': '調査変更後'
      }
    ]
    console.log(json)
    const client = await this.getAuthClient()
    const response = await client
      .api('/me/onenote/pages/' + pageId + '/content')
      .patch(JSON.stringify(stream))
    console.log(response)
    return response
  }
}

const graphService = new GraphService()

export default graphService
