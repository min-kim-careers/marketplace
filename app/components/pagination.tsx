import {
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/app/components/shadcn/components/ui/pagination'
import useMarketStore from '@/app/store/market-store'
import { useState } from 'react'

export default function Pagination({
  page,
  limit,
}: {
  page: number
  limit: number
}) {
  const [currentPage, setCurrentPage] = useState(page)
  const [currentLimit, setCurrentLimit] = useState(limit)

  const { count, getItems } = useMarketStore()

  const handlePageChange = async (page: number) => {
    // getItems(page, limit)
  }

  return (
    <PaginationContainer>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href=''
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(page - 1)
            }}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            isActive={page === page}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(page)
            }}
          >
            {page === 1 ? page : page - 1}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            isActive={page === page}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(page)
            }}
          >
            {page === 1 ? page + 1 : page}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            isActive={page === page}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(page)
            }}
          >
            {page === 1 ? page + 2 : page + 1}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(page + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationContainer>
  )
}
