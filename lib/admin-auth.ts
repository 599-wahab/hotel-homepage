// lib/admin-auth.ts
let isAuthenticated = false

export function loginAdmin(username: string, password: string): boolean {
  if (username === "marigold-Admin" && password === "marigold-nagi") {
    isAuthenticated = true
    return true
  }
  return false
}

export function logoutAdmin() {
  isAuthenticated = false
}

export function isAdminLoggedIn() {
  return isAuthenticated
}
