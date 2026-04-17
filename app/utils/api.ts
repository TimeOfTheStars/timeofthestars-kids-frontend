type ApiErrorDetails = {
  status?: number
  message: string
  data?: unknown
}

export class ApiError extends Error {
  status?: number
  data?: unknown

  constructor(details: ApiErrorDetails) {
    super(details.message)
    this.name = 'ApiError'
    this.status = details.status
    this.data = details.data
  }
}

const API_BASE_URL = 'https://api.timeofthestars-kids.ru'

export async function postJson<TResponse = unknown>(
  path: string,
  body: unknown,
  init?: RequestInit
): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    body: JSON.stringify(body),
    ...init
  })

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')

  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null)

  if (!res.ok) {
    const message =
      (typeof data === 'object' && data && 'message' in data && typeof (data as any).message === 'string'
        ? (data as any).message
        : null) || `HTTP ${res.status}`

    throw new ApiError({ status: res.status, message, data })
  }

  return data as TResponse
}

