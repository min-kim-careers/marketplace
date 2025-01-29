'use client'

import { SearchParams } from '@/types/search-params'
import { create } from 'zustand'

const DEFAULT_PARAMS: SearchParams = {
  page: 1,
  limit: 9,
}

interface SearchStore {
  params: SearchParams
  setParams: (params: SearchParams) => void
}

const useSearchStore = create<SearchStore>((set) => {
  const params = DEFAULT_PARAMS

  const setParams = (params: SearchParams) => {
    set({
      params: {
        ...DEFAULT_PARAMS,
        ...params,
      },
    })
  }

  return {
    params,
    setParams,
  }
})

export default useSearchStore
