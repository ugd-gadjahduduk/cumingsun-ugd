'use client'

import { useState, useEffect } from 'react'
import type { LocationData } from '@/types'
import { MagneticElement } from './MagneticElement'
import GadjahDudukLogo from './GadjahDudukLogo'

export function Overlay() {
  const [currentTime, setCurrentTime] = useState<string>('')
  const [locationText, setLocationText] = useState<string>(' ')

  // Initialize time on client side
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    }

    // Set initial time
    updateTime()

    // Update every second
    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch location data with localStorage
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data: LocationData = await response.json()

        // Get last visit from localStorage
        const lastVisitData = localStorage.getItem('lastVisit')

        if (lastVisitData) {
          // Show previous visit location
          const lastVisit = JSON.parse(lastVisitData)
          setLocationText(`Last visit from ${lastVisit.city}, ${lastVisit.country}`)
        } else {
          // First time visiting - show current location as "last visit" (gimmick)
          if (data.city && data.country_name) {
            setLocationText(`Last visit from ${data.city}, ${data.country_name}`)
          } else {
            setLocationText('Last visit from Unknown location')
          }
        }

        // Save current visit for next time
        if (data.city && data.country_name) {
          localStorage.setItem(
            'lastVisit',
            JSON.stringify({
              city: data.city,
              country: data.country_name,
              timestamp: new Date().toISOString(),
            })
          )
        }
      } catch (error) {
        console.error('Failed to fetch location:', error)
        setLocationText('Location unavailable')
      }
    }

    fetchLocation()
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none w-full h-full flex flex-col justify-between">
      {/* Time - bottom left */}
      <div className="absolute bottom-10 left-10 text-base mix-blend-difference text-white">
        {currentTime}
      </div>

      {/* Logo - top left with magnetic effect */}
      <MagneticElement
        className="absolute top-6 left-6 pointer-events-auto cursor-default z-50 select-none mix-blend-difference"
        strength={0.4}
        radius={120}
        duration={0.4}
        ease="power3.out"
        resetEase="elastic.out(1, 0.4)"
        resetDuration={0.6}
      >
        <GadjahDudukLogo
          className="w-12 h-12 md:w-[50px] md:h-[50px] text-white"
          aria-hidden
        />
      </MagneticElement>

      {/* Location - bottom right */}
      <div className="absolute bottom-10 right-10 text-base text-right mix-blend-difference text-white">
        {locationText}
      </div>

      {/* UGD text - top right */}
      <MagneticElement
        className="absolute top-10 right-10 pointer-events-auto cursor-default z-50 select-none mix-blend-difference"
        strength={0.3}
        radius={100}
        duration={0.4}
        ease="power3.out"
        resetEase="elastic.out(1, 0.4)"
        resetDuration={0.6}
      >
        <div className="text-base font-medium text-white">UGD</div>
      </MagneticElement>
    </div>
  )
}
