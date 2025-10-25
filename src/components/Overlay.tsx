'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { LocationData } from '@/types'

export function Overlay() {
  const [currentTime, setCurrentTime] = useState<string>('')
  const [locationText, setLocationText] = useState<string>(' ')

  // Initialize time on client side
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit'
        })
      )
    }

    // Set initial time
    updateTime()

    // Update every second
    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch location data
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data: LocationData = await response.json()
        
        if (data.city && data.country_name) {
          setLocationText(`Last visit from ${data.city}, ${data.country_name}`)
        } else {
          setLocationText('Last visit from Unknown location')
        }
      } catch (error) {
        console.error('Failed to fetch location:', error)
        setLocationText('Last visit from Unknown location')
      }
    }

    fetchLocation()
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none w-full h-full flex flex-col justify-between">
      {/* Current time - bottom left */}
      <div className="absolute bottom-10 left-10 text-base">
        {currentTime}
      </div>
      
      {/* Logo - top left */}
      <div className="absolute top-6 left-6">
        <Image
          src="/GadjahDuduk.svg"
          alt="UGD Logo"
          width={50}
          height={50}
          className="w-12 h-12 md:w-[50px] md:h-[50px]"
          priority
        />
      </div>
      
      {/* Location - bottom right */}
      <div className="absolute bottom-10 right-10 text-base text-right">
        {locationText}
      </div>
      
      {/* UGD text - top right */}
      <div className="absolute top-10 right-10 text-base font-medium">
        UGD
      </div>
    </div>
  )
}
