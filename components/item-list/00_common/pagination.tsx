'use client'

import {
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
} from '@/components/shadcn/components/ui/pagination'
import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { toPath } from '@/lib/helpers/to-path'
import { useItemPageContext } from '@/lib/providers/item-page-provider'
import { notFound } from 'next/navigation'

export default function Pagination() {
  const { count, params, route } = useItemPageContext()

  const lastPage = Math.ceil(count / DEFAULT_ITEM_PAGINATION.LIMIT)

  if (params.page < 1 && lastPage < params.page) notFound()

  const paginationArray = Array.from(
    { length: DEFAULT_ITEM_PAGINATION.SIZE },
    (_, index) => {
      if (params.page < 3) {
        return index + 1
      } else {
        if (params.page + 3 > lastPage) {
          return lastPage - 4 + index
        }
        return params.page - 2 + index
      }
    },
  )

  return (
    <PaginationContainer>
      <PaginationContent>
        <PaginationFirst
          disabled={params.page === 1 || !count}
          href={toPath(route, { ...params, page: 1 })}
        />

        {paginationArray.map(
          (page, index) =>
            1 <= page &&
            page <= lastPage && (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={params.page === page}
                  href={toPath(route, { ...params, page: page })}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
        )}

        <PaginationLast
          disabled={params.page === lastPage || !count}
          href={toPath(route, { ...params, page: lastPage })}
        />
      </PaginationContent>
    </PaginationContainer>
  )
}
