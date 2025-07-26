'use server'

import { GatewayResponse } from '@/lib/clients/_response'
import { getSession } from '@/lib/helpers/server/get-session'
import { toURLSearchParams } from '@/lib/helpers/to-url-search-params'
import { envLoader } from '@/lib/utils/env-loader'

type RequestOpts = {
  withSession?: boolean
}

const defaultOpts: RequestOpts = {
  withSession: false,
} as const

type ApiKey = {
  header: string
  key: string
}

class MakeClient {
  private method!: string
  private base!: string
  private apiKey: any = null

  private path: string = ''
  private headers: any = null
  private query: any = null
  private body: any = null

  constructor(base: string) {
    this.base = base
    return this
  }

  private setMethod(method: string): this {
    this.method = method
    this.headers = {
      ...this.headers,
      accept: 'application/json',
    }
    return this
  }

  // private reset(): this {
  //   this.method = ''
  //   this.path = ''
  //   this.body = null
  //   this.headers = {}
  //   return this
  // }

  get(path: string): this {
    this.path = path
    this.setMethod('GET')
    return this
  }

  post(path: string): this {
    this.path = path
    this.setMethod('POST')
    return this
  }

  put(path: string): this {
    this.path = path
    this.setMethod('PUT')
    return this
  }

  delete(path: string): this {
    this.path = path
    this.setMethod('DELETE')
    return this
  }

  addApiKey(apiKey: ApiKey): this {
    this.apiKey = { [apiKey.header]: apiKey.key }
    return this
  }

  addBody(body: any, isForm: boolean = false): this {
    if (this.method === 'GET') throw new Error('get method cannot have body')
    this.body = body
    this.headers = {
      ...this.headers,
      ...(!isForm && {
        'content-type': 'application/json',
      }),
    }
    return this
  }

  addQuery(query: any): this {
    this.query = toURLSearchParams(query).toString()
    return this
  }

  addHeaders(headers: any): this {
    this.headers = {
      ...this.headers,
      ...headers,
    }
    return this
  }

  async result<T>(opts: RequestOpts = defaultOpts): Promise<T> {
    if (opts.withSession) {
      const session = await getSession()
      if (session) {
        this.headers = {
          ...this.headers,
          cookie: `${envLoader.sessionHeader}=${session}`,
        }
      }
    }

    const url = new URL(this.path, this.base)
    if (this.query) url.search = this.query
    const init: RequestInit = {
      method: this.method,
      headers: { ...this.headers, ...this.apiKey },
      ...(this.body && { body: this.body }),
    }
    try {
      console.log(
        '------------------------------ web ------------------------------',
      )
      console.log(url.toString())
      console.log(init)

      const res = await fetch(url.toString(), init)
      if (!res.ok) {
        throw new Error(`${res.status} - ${res.statusText}`)
      }

      const { data, message } = (await res.json()) as GatewayResponse<T>
      message && console.log({ gatewayResponse: message })

      return data as T
    } catch (error) {
      console.error(error)
      throw new Error()
    }
  }
}

export const makeClient = async () => new MakeClient(envLoader.gatewayUrl)
