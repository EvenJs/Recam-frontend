import { useQuery } from '@tanstack/react-query'
import { getListings } from '@/api/listing.api'
import type { ListcaseStatus } from '@/types/enums'
// import type { ListingCase } from '@/types/models'

interface UseListingsParams {
  page: number
  pageSize: number
  status?: ListcaseStatus
}

export function useListings({ page, pageSize, status }: UseListingsParams) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['listings', page, pageSize, status ?? 'all'],
    queryFn: () => getListings({ page, pageSize, status }),
  })

  return {
    listings: data?.items ?? [],
    totalCount: data?.totalCount ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError,
    refetch,
  }
}