// lib/admin-auth.ts
let isAuthenticated = false

export function loginAdmin(username: string, password: string): boolean {
  if (username === "marigold-admin" && password === "marigold-nagi") {
    isAuthenticated = true
    localStorage.setItem('admin-authenticated', 'true')
    return true
  }
  return false
}

export function logoutAdmin() {
  isAuthenticated = false
  localStorage.removeItem('admin-authenticated')
}

export function isAdminLoggedIn() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin-authenticated') === 'true'
  }
  return isAuthenticated
}