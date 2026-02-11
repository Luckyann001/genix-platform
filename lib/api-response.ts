import { NextResponse } from 'next/server'

type ResponseBody<T = any> = { data?: T; error?: string }

export function successResponse<T = any>(data: T, statusCode = 200) {
  const body: ResponseBody<T> = { data }
  return NextResponse.json(body, { status: statusCode })
}

export function errorResponse(message: string, statusCode = 400) {
  const body: ResponseBody = { error: message }
  return NextResponse.json(body, { status: statusCode })
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return errorResponse(message, 401)
}

export function notFoundResponse(message = 'Not Found', statusCode = 404) {
  return errorResponse(message, statusCode)
}

export function serverErrorResponse(error: any, statusCode = 500) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Server error:', error)
    const message = (error && error.message) ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
  console.error('Server error:', error)
  return NextResponse.json({ error: 'Internal Server Error' }, { status: statusCode })
}
