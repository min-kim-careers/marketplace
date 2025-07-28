'use server'

import { GatewayResponse } from '@/lib/clients/types'
import { getSession } from '@/lib/helpers/server/get-session'
import { toURLSearchParams } from '@/lib/helpers/to-url-search-params'
import { envLoader } from '@/lib/utils/env-loader'
import { Dispatcher, request } from 'undici'
import FormData from 'form-data'

type RequestOpts = {
  withSession?: boolean
}

type ApiKey = {
  header: string
  key: string
}

class SSRClient {
  private base!: string
  private url!: URL

  private init: Partial<Dispatcher.RequestOptions> = {
    headers: { accept: 'application/json' },
  }

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
    this.addHeader({ ...form.getHeaders() })
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

      console.log(
        '------------------------------ web ------------------------------',
      )
      console.log(this.url.toString())

      console.log({
        ...this.init,
        // ...(this.init.body && { body: 'redacted' }),
        headers: {
          ...this.init.headers,
          ...((this.init.headers as any).cookie && { cookie: 'redacted' }),
        },
      })
      console.log(
        '-----------------------------------------------------------------',
      )
      const resp = await request(this.url, this.init)
      return await resp.body.json()
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

export const SSRGateway = async () => new SSRClient().setBase(envLoader.gatewayUrl)
