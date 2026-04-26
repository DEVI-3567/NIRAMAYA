import { useEffect, useRef, useState, useCallback } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const loader = new Loader({
  apiKey: API_KEY,
  version: 'weekly',
  libraries: ['places', 'geometry']
})

const DARK_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0d1117' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1117' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a2332' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1e3a5f' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#050a14' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#334155' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.medical', stylers: [{ visibility: 'on' }] },
  { featureType: 'poi.medical', elementType: 'geometry', stylers: [{ color: '#1a2332' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
]

export function useGoogleMap(containerRef, options = {}) {
  const [map, setMap] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const markersRef = useRef([])
  const polylinesRef = useRef([])
  const googleRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    loader.load().then((google) => {
      googleRef.current = google
      const mapInstance = new google.maps.Map(containerRef.current, {
        zoom: options.zoom || 13,
        center: options.center || { lat: 20.2961, lng: 85.8245 },
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        styles: DARK_STYLE,
        gestureHandling: 'greedy',
      })
      setMap(mapInstance)
      setLoaded(true)
    }).catch(err => console.error('Maps load error:', err))
  }, [])

  const addMarker = useCallback((position, label, color = '#f43f5e', title = '') => {
    if (!googleRef.current || !map) return null
    const google = googleRef.current
    const marker = new google.maps.Marker({
      position, map, title,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: color,
        fillOpacity: 0.9,
        strokeColor: '#ffffff',
        strokeWeight: 2.5,
      },
      label: label ? { text: label, color: '#fff', fontSize: '10px', fontWeight: 'bold', fontFamily: 'Inter' } : undefined,
      animation: google.maps.Animation.DROP,
    })
    markersRef.current.push(marker)
    return marker
  }, [map])

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []
  }, [])

  const drawRoute = useCallback((encodedPolyline) => {
    if (!googleRef.current || !map) return
    const google = googleRef.current
    const path = google.maps.geometry.encoding.decodePath(encodedPolyline)
    const polyline = new google.maps.Polyline({
      path, geodesic: true,
      strokeColor: '#34d399',
      strokeOpacity: 0.85,
      strokeWeight: 4,
      map,
      icons: [{
        icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3, strokeColor: '#fff', strokeWeight: 1 },
        offset: '0', repeat: '80px'
      }]
    })
    polylinesRef.current.push(polyline)
  }, [map])

  const fitBounds = useCallback((points) => {
    if (!googleRef.current || !map || !points.length) return
    const bounds = new googleRef.current.maps.LatLngBounds()
    points.forEach(p => bounds.extend(p))
    map.fitBounds(bounds, 60)
  }, [map])

  const searchNearbyHospitals = useCallback((location) => {
    return new Promise((resolve) => {
      if (!googleRef.current || !map) { resolve([]); return }
      const service = new googleRef.current.maps.places.PlacesService(map)
      service.nearbySearch({
        location, radius: 10000, type: 'hospital'
      }, (results, status) => {
        if (status === 'OK') {
          const hospitals = results.slice(0, 6).map(r => ({
            name: r.name,
            address: r.vicinity,
            lat: r.geometry.location.lat(),
            lng: r.geometry.location.lng(),
            rating: r.rating,
            open: r.opening_hours?.isOpen?.() ?? true,
          }))
          resolve(hospitals)
        } else { resolve([]) }
      })
    })
  }, [map])

  return { map, loaded, addMarker, clearMarkers, drawRoute, fitBounds, searchNearbyHospitals }
}
