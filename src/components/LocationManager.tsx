import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import {
  buildCityAllPath,
  fetchCityFromCoords,
  getStoredLocation,
  normalizeCitySlug,
  saveLocationLocally,
  type LocationCache,
} from '@/lib/location'
import { getMyHomeLocation, updateMyHomeCity } from '@/lib/auth.functions'

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 5 * 60 * 1000,
}

export function LocationManager() {
  const { data: session } = authClient.useSession()
  const navigate = useNavigate()
  const location = useLocation()
  const boot = getStoredLocation()
  const lastDetectedCityRef = useRef<string>(boot.city)
  const lastPromptedCityRef = useRef<string | null>(null)
  const lastSyncedUserCityRef = useRef<string>('')
  const lastCoordsRef = useRef<{ lat?: number; lng?: number }>({ lat: boot.lat, lng: boot.lng })

  useEffect(() => {
    let isDisposed = false
    if (!navigator.geolocation) return

    const applyDetectedCity = async (next: LocationCache) => {
      const cityCandidate = next.city
      const city = normalizeCitySlug(cityCandidate)
      if (!city || isDisposed) return

      const previous = lastDetectedCityRef.current
      const prevLat = lastCoordsRef.current.lat
      const prevLng = lastCoordsRef.current.lng
      const hasCityChanged = previous !== city
      const hasCoordsChanged = prevLat !== next.lat || prevLng !== next.lng
      if (!hasCityChanged && !hasCoordsChanged) return

      lastDetectedCityRef.current = city
      lastCoordsRef.current = { lat: next.lat, lng: next.lng }
      saveLocationLocally({ city, lat: next.lat, lng: next.lng })

      if (session?.user) {
        try {
          await updateMyHomeCity({ data: { city, lat: next.lat, lng: next.lng } })
          lastSyncedUserCityRef.current = `${session.user.id}:${city}`
        } catch {
          // Non-blocking: local persistence still works.
        }
      }

      const currentPath = location.pathname
      const cityPath = buildCityAllPath(city)
      const isOnRoot = currentPath === '/'
      const isOnCityRoute = /^\/[^/]+\/all\/?$/.test(currentPath)

      if (isOnRoot) {
        navigate({ to: '/$city/all', params: { city } })
        return
      }

      if (isOnCityRoute && currentPath !== cityPath && lastPromptedCityRef.current !== city) {
        lastPromptedCityRef.current = city
        const accepted = window.confirm(
          `Looks like you are in ${city.replace(/-/g, ' ')}. Switch to this city's events?`,
        )
        if (accepted) {
          navigate({ to: '/$city/all', params: { city } })
        }
      }
    }

    const handlePosition = async (position: GeolocationPosition) => {
      try {
        const lat = Number(position.coords.latitude.toFixed(6))
        const lng = Number(position.coords.longitude.toFixed(6))
        const detectedCity = await fetchCityFromCoords(
          lat,
          lng,
        )
        await applyDetectedCity({ city: detectedCity, lat, lng })
      } catch {
        // Ignore lookup failures and keep existing persisted city.
      }
    }

    navigator.geolocation.getCurrentPosition(handlePosition, () => undefined, GEO_OPTIONS)
    const watchId = navigator.geolocation.watchPosition(handlePosition, () => undefined, GEO_OPTIONS)

    return () => {
      isDisposed = true
      navigator.geolocation.clearWatch(watchId)
    }
  }, [navigate, location.pathname, session?.user])

  useEffect(() => {
    if (!session?.user) return
    let cancelled = false

    const cached = getStoredLocation()
    const syncKey = `${session.user.id}:${cached.city}`
    const primeFromDb = async () => {
      try {
        const dbLocation = await getMyHomeLocation()
        if (cancelled || !dbLocation?.city) return
        // If a new device has no cache, hydrate from DB first.
        if (!cached.city || cached.city === 'bangalore') {
          saveLocationLocally(dbLocation)
          lastDetectedCityRef.current = dbLocation.city
          lastCoordsRef.current = { lat: dbLocation.lat, lng: dbLocation.lng }
        }
      } catch {
        // Non-blocking.
      }
    }

    if (lastSyncedUserCityRef.current !== syncKey && cached.city) {
      updateMyHomeCity({ data: { city: cached.city, lat: cached.lat, lng: cached.lng } })
        .then(() => {
          lastSyncedUserCityRef.current = syncKey
        })
        .catch(() => undefined)
    }

    void primeFromDb()
    return () => {
      cancelled = true
    }
  }, [session?.user])

  return null
}
