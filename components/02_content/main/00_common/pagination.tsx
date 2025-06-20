import {
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
} from '@/components/shadcn/components/ui/pagination'
import { toUrlParams } from '@/lib/helpers/to-url-params'
import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { notFound } from 'next/navigation'
import { useItemPageContext } from '@/lib/providers/item-page-provider'

export default function Pagination() {
  const { params, count, route } = useItemPageContext()

  const lastPage = Math.ceil(
    count / DEFAULT_ITEM_PAGINATION.LIMIT,
  )

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
          href={`${route}?${toUrlParams({ ...params, page: 1 })}`}
        />

        {paginationArray.map(
          (page, index) =>
            1 <= page &&
            page <= lastPage && (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={params.page === page}
                  href={`${route}?${toUrlParams(
                    {
                      ...params,
                      page: page,
                    },
                  )}`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
        )}

        <PaginationLast
          disabled={params.page === lastPage || !count}
          href={`${route}?${toUrlParams(
            {
              ...params,
              page: lastPage,
            },
          )}`}
        />
      </PaginationContent>
    </PaginationContainer>
  )
}
