import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
	return new Response(null, { status: 204 })
}

