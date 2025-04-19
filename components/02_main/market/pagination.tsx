import {
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
} from '@/components/shadcn/components/ui/pagination'
import { ROUTES } from '@/lib/routes'
import { paramsToQuery } from '@/lib/helpers'
import { QueryParams as Params } from '@/lib/interfaces/params'
import { notFound } from 'next/navigation'

const PAGINATION_SIZE = 5

export default function Pagination({
  params,
  limit,
  totalCount,
}: {
  params: Params
  limit: number
  totalCount: number
}) {
  const currentPage = params.page
  const lastPage = Math.ceil(totalCount / limit)

  if (currentPage < 1 && lastPage < currentPage) {
    notFound()
  }

  const paginationArray = Array.from(
    { length: PAGINATION_SIZE },
    (_, index) => {
      if (currentPage < 3) {
        return index + 1
      } else {
        if (currentPage + 3 > lastPage) {
          return lastPage - 4 + index
        }
        return currentPage - 2 + index
      }
    },
  )

  return (
    <PaginationContainer>
      <PaginationContent>
        <PaginationFirst
          disabled={currentPage === 1}
          href={{
            pathname: ROUTES.MARKET,
            query: { ...paramsToQuery(params), page: 1 },
          }}
        />

        {paginationArray.map(
          (page, index) =>
            1 <= page &&
            page <= lastPage && (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={currentPage === page}
                  href={{
                    pathname: ROUTES.MARKET,
                    query: {
                      ...paramsToQuery(params),
                      page: page,
                    },
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
        )}

        <PaginationLast
          disabled={currentPage === lastPage}
          href={{
            pathname: ROUTES.MARKET,
            query: {
              ...paramsToQuery(params),
              page: lastPage,
            },
          }}
        />
      </PaginationContent>
    </PaginationContainer>
  )
}
