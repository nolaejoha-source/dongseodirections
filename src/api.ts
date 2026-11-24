const configuredApiBase = (import.meta.env?.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '')

export const hasApiBackend = configuredApiBase.length > 0

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${configuredApiBase}${normalizedPath}`
}
