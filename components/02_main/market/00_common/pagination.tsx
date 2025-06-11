import {
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
} from '@/components/shadcn/components/ui/pagination'
import { ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { ROUTES } from '@/lib/constants/routes'
import useMarketStore  from '@/lib/stores/market'
import { serialize } from '@/lib/common/market-helpers'
import { notFound, useSearchParams } from 'next/navigation'

export default function Pagination() {
  const { params } = useMarketStore()
  const { count } = useMarketStore()

  const lastPage = Math.ceil(count / ITEM_PAGINATION.LIMIT)

  if (params.page < 1 && lastPage < params.page) {
    notFound()
  }

  const paginationArray = Array.from(
    { length: ITEM_PAGINATION.SIZE },
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
          disabled={params.page === lastPage || !count}
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
