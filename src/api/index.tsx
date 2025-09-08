import { ReactNode, createContext, useContext, useRef } from 'react'
import OpenAPIClientAxios from 'openapi-client-axios'
import axios from 'axios'
import { Client } from './gen/client'
import definition from './gen/schema.json'

interface ApiContextState {
  client: Client | undefined
}

const ApiContext = createContext<ApiContextState>({
  client: undefined,
})

interface ApiProviderProps {
  url: string
  token: string
  children?: ReactNode
}

export const ApiProvider: React.FC<ApiProviderProps> = ({
  url,
  token,
  children,
}) => {
  const apiRef = useRef<OpenAPIClientAxios | null>(null)
  if (!apiRef.current) {
    const instance = new OpenAPIClientAxios({
      /* @ts-ignore */
      definition,
      withServer: { url },
      axiosConfigDefaults: {
        headers: { 'X-SESSION': token },
      },
    })
    // IMPORTANT: Override the per-instance getAxiosInstance BEFORE initSync runs.
    // The library defines getAxiosInstance as an instance field (not prototype), so
    // patching prototype earlier had no effect. We replace it here to normalize axios export shape.
    ;(instance as any).getAxiosInstance = function getAxiosInstancePatched(
      this: any
    ) {
      const mod: any = axios as any
      const candidate =
        mod && typeof mod === 'function' && typeof mod.create === 'function'
          ? mod
          : mod?.default && typeof mod.default.create === 'function'
          ? mod.default
          : null
      if (!candidate) {
        // Last resort: throw explicit error so we know actual shape
        console.error('Axios export shape', Object.keys(mod || {}), mod)
        throw new Error('Unable to locate axios.create on axios export')
      }
      return candidate.create(this.axiosConfigDefaults)
    }
    apiRef.current = instance
  }
  const clientRef = useRef(apiRef.current.initSync<Client>())

  return (
    <ApiContext.Provider value={{ client: clientRef.current }}>
      {children}
    </ApiContext.Provider>
  )
}

export const useApi = () => {
  const { client } = useContext(ApiContext)

  if (!client) {
    throw new Error('A client API must be defined')
  }

  return client
}
