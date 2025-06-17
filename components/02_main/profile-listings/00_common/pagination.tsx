import {
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
} from '@/components/shadcn/components/ui/pagination'
import { toUrlParams } from '@/lib/common/helpers'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import useListingsStore from '@/lib/stores/listing'
import { notFound } from 'next/navigation'

export default function Pagination() {
  const { params, count } = useListingsStore()

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
          href={`${APP_ROUTES.PROFILE_LISTINGS.url}?${toUrlParams({ ...params, page: 1 })}`}
        />

        {paginationArray.map(
          (page, index) =>
            1 <= page &&
            page <= lastPage && (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={params.page === page}
                  href={`${APP_ROUTES.PROFILE_LISTINGS.url}?${toUrlParams(
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
          href={`${APP_ROUTES.PROFILE_LISTINGS.url}?${toUrlParams(
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
