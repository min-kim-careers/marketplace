import { GatewayResponse } from '@/api/types'
import { getSession } from '@/lib/helpers/server/get-session'
import { toURLSearchParams } from '@/lib/helpers/to-url-search-params'
import { envLoader } from '@/lib/utils/env-loader'

type RequestOpts = {
  withSession?: boolean
}

type ApiKey = {
  header: string
  key: string
}

class Client {
  private base!: string
  private url!: URL

  private init: RequestInit = { headers: { accept: 'application/json' } }

  private setMethod(method: string): this {
    this.init = { ...this.init, method }
    return this
  }

  private addHeader(header: any): this {
    this.init = {
      ...this.init,
      headers: {
        ...this.init.headers,
        ...header,
      },
    }
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

  setBody(body: any): this {
    this.init = {
      ...this.init,
      body: JSON.stringify(body),
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

  async result(
    opts: RequestOpts = {
      withSession: false,
    },
  ): Promise<any> {
    try {
      const { withSession } = opts

      if (withSession) {
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

      const resp = await fetch(this.url.toString(), this.init)
      if (!resp.ok) {
        throw new Error(`${resp.status} - ${resp.statusText}`)
      }
      return await resp.json()
    } catch (error) {
      console.error(error)
      throw new Error('error fetching response')
    }
  }

  async asResult<T>(
    opts: RequestOpts = {
      withSession: false,
    },
  ): Promise<T> {
    try {
      const { data, message } = (await this.result(opts)) as GatewayResponse<T>
      message && console.log({ client: message })
      return data as T
    } catch (error) {
      console.error(error)
      throw new Error('error parsing response')
    }
  }
}

export const client = async () =>
  new Client()
    .setBase(envLoader.apiUrl)
    .setApiKey({ header: envLoader.apiKeyHeader, key: envLoader.apiKey })
