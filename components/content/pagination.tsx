import {
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
} from '@/components/shadcn/components/ui/pagination'
import { ROUTES } from '@/constants/routes'
import { SearchParams } from '@/types/search-params'
import { notFound } from 'next/navigation'

const PAGINATION_SIZE = 5

export default function Pagination({
  params,
  totalCount,
}: {
  params: SearchParams
  totalCount: number
}) {
  const currentPage = params.page
  const lastPage = Math.floor(totalCount / params.limit)

  if (currentPage < 1 || lastPage < currentPage) {
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
          href={{
            pathname: ROUTES.SEARCH,
            query: {
              page: 1,
            },
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
                    pathname: ROUTES.SEARCH,
                    query: {
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
          href={{
            pathname: ROUTES.SEARCH,
            query: {
              page: lastPage,
            },
          }}
        />
      </PaginationContent>
    </PaginationContainer>
  )
}
