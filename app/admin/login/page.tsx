// app/admin/login/page.tsx
'use client'

import { useState } from 'react'
import { loginAdmin } from '@/lib/admin-auth'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }

    setIsLoading(true)
    try {
      const success = await Promise.resolve(loginAdmin(username.trim(), password))
      if (success) {
        router.push('/admin/dashboard')
      } else {
        setError('Invalid credentials')
      }
    } catch (err) {
      setError('Something went wrong. Try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="mx-auto bg-white/20 backdrop-blur-sm p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-4">
            <div className="bg-white p-2 rounded-lg">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Marigold Hotel</h1>
          <p className="text-yellow-100 mt-1 text-sm">Admin Portal</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl border border-white/20 shadow-xl"
          aria-labelledby="admin-login-heading"
        >
          <h2 id="admin-login-heading" className="text-xl sm:text-2xl font-bold text-white mb-4 text-center">
            Admin Login
          </h2>

          <div role="status" aria-live="polite" className="min-h-[1.25rem]">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 text-red-100 rounded-lg text-center text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-yellow-100">Username</span>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Enter username"
                className="mt-1 w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label className="block relative">
              <span className="text-sm font-medium text-yellow-100">Password</span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter password"
                className="mt-1 w-full p-3 pr-12 rounded-lg bg-white/10 border border-white/20 text-white placeholder-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-100 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>
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

          <div className="mt-3 flex items-center justify-between text-xs text-yellow-100">
            <label className="flex items-center gap-2 select-none">
              <input type="checkbox" className="h-4 w-4 accent-yellow-500" />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => alert('Contact your system administrator to reset password')}
              className="underline"
            >
              Forgot?
            </button>
          </div>
        </form>

        <p className="text-center text-yellow-100 mt-6 text-sm">
          © {new Date().getFullYear()} Marigold Hotel. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}
