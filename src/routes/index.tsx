import { createFileRoute, redirect } from '@tanstack/react-router'
import { getBestStoredCity } from '@/lib/location'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const city = getBestStoredCity()
    throw redirect({
      to: '/$city/all',
      params: { city },
    })
  },
  component: EmptyHome,
})

function EmptyHome() {
  return null
}

