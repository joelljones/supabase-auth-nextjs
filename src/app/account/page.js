import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AccountForm from './AccountForm'

export const metadata = {
	title: 'Account - Supabase Auth - Next.js',
	description: 'Manage your account',
}

export default async function Account() {
	const supabase = createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	// Redirect if no user is found, but only in production
	if (!user && process.env.NODE_ENV === 'production') {
		redirect('/login')
	}

	return <AccountForm user={user} />
}
