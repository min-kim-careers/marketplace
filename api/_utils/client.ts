import 'server-only'

import { APIError, APIResponse } from '@/api/endpoints/types'
import { getSession } from '@/lib/helpers/server/get-session'
import { toURLSearchParams } from '@/lib/helpers/to-url-search-params'
import { envLoader } from '@/lib/utils/env-loader'
import { cleanObject } from '@/lib/helpers/clean-object'

type ApiKey = {
  header: string
  key: string
}

class Client {
  private base!: string
  private url!: URL
  private useSession: boolean = false

  private init: Partial<RequestInit> = {
    headers: { accept: 'application/json' },
  }

  private setMethod(method: string): this {
    this.init = { ...this.init, method }
    return this
  }

  private setPath(path: string): this {
    this.url = new URL(path, this.base)
    return this
  }

  setBase(base: string): this {
    this.base = base
    return this
  }

  addHeader(header: any): this {
    this.init = {
      ...this.init,
      headers: {
        ...this.init.headers,
        ...header,
      },
    }
    return this
  }

  setBody(body: any): this {
    const obj = cleanObject(body)
    if (Object.keys(obj).length === 0) {
      throw new Error("empty body")
    }
    this.init = {
      ...this.init,
      body: JSON.stringify(cleanObject(body)),
    }
    this.addHeader({ 'content-type': 'application/json' })
    return this
  }

  setForm(form: FormData): this {
    this.init = {
      ...this.init,
      body: form,
    }
    return this
  }

  get(path: string): this {
    this.setPath(path)
    this.setMethod('GET')
    return this
  }

  post(path: string): this {
    this.setPath(path)
    this.setMethod('POST')
    return this
  }

  put(path: string): this {
    this.setPath(path)
    this.setMethod('PUT')
    return this
  }

  delete(path: string): this {
    this.setPath(path)
    this.setMethod('DELETE')
    return this
  }

  setApiKey(apiKey: ApiKey): this {
    this.addHeader({ [apiKey.header]: apiKey.key })
    return this
  }

  setQuery(query: any): this {
    this.url.search = toURLSearchParams(query).toString()
    return this
  }

  withSession(): this {
    this.useSession = true
    return this
  }

  async result(): Promise<any> {
    try {
      if (this.useSession) {
        const session = await getSession()
        if (session)
          this.addHeader({ cookie: `${envLoader.sessionHeader}=${session}` })
      }

      console.log(this.url.toString())
      // console.log({
      //   ...this.init,
      //   ...(this.init.body && { body: 'redacted' }),
      //   headers: {
      //     ...this.init.headers,
      //     ...((this.init.headers as any).cookie && { cookie: 'redacted' }),
      //   },
      // })

      const resp = await fetch(this.url.toString(), this.init as RequestInit)
      if (!resp.ok) {
        const err = await resp.text() as APIError
        console.log(err)
        throw new Error()
      }
      return await resp.json()
    } catch (error) {
      throw new Error()
    }
  }

  async asResult<T>(): Promise<T> {
    try {
      const { data, message } = (await this.result()) as APIResponse<T>
      message && console.log('API: ', message)
      return data as T
    } catch (error) {
      throw new Error()
    }
  }
}

export const client = async () =>
  new Client()
    .setBase(envLoader.apiUrl)
    .setApiKey({ header: envLoader.apiKeyHeader, key: envLoader.apiKey })
