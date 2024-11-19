import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
	const { searchParams } = new URL(request.url)
	const code = searchParams.get('code')
	const next = searchParams.get('next') ?? '/'

	if (code) {
		const supabase = createClient()
		const { error } = await supabase.auth.exchangeCodeForSession(code)

		if (error) {
			return NextResponse.redirect(`${request.nextUrl.origin}/error`)
		}
	}

	const redirectUrl = new URL(`${request.nextUrl.origin}${next}`)
	redirectUrl.searchParams.set('type', 'recovery')
	return NextResponse.redirect(redirectUrl)
}
