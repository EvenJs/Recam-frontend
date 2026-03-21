import { useQuery } from '@tanstack/react-query'
import { getMedia } from '@/api/media.api'

export function useMedia(listingId: number) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['media', listingId],
    queryFn: () => getMedia(listingId),
  })

  const all = data ?? []

  return {
    all,
    pictures: all.filter(m => m.mediaType === 1),
    videos: all.filter(m => m.mediaType === 2),
    floorPlans: all.filter(m => m.mediaType === 3),
    vrTours: all.filter(m => m.mediaType === 4),
    isLoading,
    isError,
    refetch,
  }
}