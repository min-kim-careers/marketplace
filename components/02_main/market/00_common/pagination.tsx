import {
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
} from '@/components/shadcn/components/ui/pagination'
import { PAGINATION } from '@/lib/constants/pagination'
import { ROUTES } from '@/lib/constants/routes'
import { useMarketStore } from '@/lib/stores/market'
import { serialize } from '@/lib/helpers/market'
import { notFound, useSearchParams } from 'next/navigation'

export default function Pagination() {
  const { params } = useMarketStore()
  const { count } = useMarketStore()

  const lastPage = Math.ceil(count / PAGINATION.LIMIT)

  if (params.page < 1 && lastPage < params.page) {
    notFound()
  }

  const paginationArray = Array.from(
    { length: PAGINATION.SIZE },
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
          disabled={params.page === 1}
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
                  isActive={params.page === page}
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
          disabled={params.page === lastPage}
          href={{
            pathname: ROUTES.MARKET,
            query: serialize({
              ...params,
              page: lastPage,
            }),
          }}
        />
      </PaginationContent>
    </PaginationContainer>
  )
}
