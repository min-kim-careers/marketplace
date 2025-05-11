import {
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
} from '@/components/shadcn/components/ui/pagination'
import { ROUTES } from '@/lib/constants/routes'
import { serialize } from '@/lib/utils/params'
import { MarketParams } from '@/lib/interfaces/items'
import { notFound } from 'next/navigation'
import { PAGINATION } from '@/lib/constants/pagination'

export default function Pagination({
  params,
  count,
}: {
  params: MarketParams
  count: number
}) {
  const currentPage = params.page
  const lastPage = Math.ceil(count / PAGINATION.LIMIT)

  if (currentPage < 1 && lastPage < currentPage) {
    notFound()
  }

  const paginationArray = Array.from(
    { length: PAGINATION.SIZE },
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
            query: serialize({ ...params, page: 1 }),
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
                    query: serialize({
                      ...params,
                      page: page,
                    }),
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
            query: serialize({ ...params, page: lastPage }),
          }}
        />
      </PaginationContent>
    </PaginationContainer>
  )
}
