"use client"
import "./globals.css"
import { Suspense } from 'react'
import Loading from './components/Loading'


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-verdana antialiased bg-palesage text-gray-200">
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </body>
    </html>
  )
}