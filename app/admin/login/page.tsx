// app/admin/login/page.tsx
'use client'

import { useState } from 'react'
import { loginAdmin } from '@/lib/admin-auth'
import { motion } from 'framer-motion'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    setTimeout(() => {
      const success = loginAdmin(username, password)
      if (success) {
        window.location.href = '/admin/dashboard'
      } else {
        setError('Invalid credentials')
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="mx-auto bg-white/20 backdrop-blur-sm p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-4">
            <div className="bg-white p-2 rounded-lg">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Marigold Hotel</h1>
          <p className="text-yellow-100 mt-2">Admin Portal</p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-100 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-yellow-100 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-yellow-100 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold text-yellow-900 bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="text-center text-yellow-100 mt-6 text-sm">
          © {new Date().getFullYear()} Marigold Hotel. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}