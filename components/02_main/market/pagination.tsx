import {
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
} from '@/components/shadcn/components/ui/pagination'
import { ROUTES } from '@/lib/constants/routes'
import { paramsToQuery } from '@/lib/utils/common'
import { URLParams as URLParams } from '@/lib/interfaces/params'
import { notFound } from 'next/navigation'

const PAGINATION_SIZE = 5

export default function Pagination({
  urlParams,
  limit,
  count,
}: {
  urlParams: URLParams
  limit: number
  count: number
}) {
  const currentPage = urlParams.page
  const lastPage = Math.ceil(count / limit)

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
            query: { ...paramsToQuery(urlParams), page: 1 },
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
                      ...paramsToQuery(urlParams),
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
              ...paramsToQuery(urlParams),
              page: lastPage,
            },
          }}
        />
      </PaginationContent>
    </PaginationContainer>
  )
}
