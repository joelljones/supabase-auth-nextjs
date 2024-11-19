'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function resetPassword(formData) {
	const supabase = createClient()
	const password = formData.get('password')

	const { error } = await supabase.auth.updateUser({
		password: password,
	})

	if (error) {
		redirect('/error')
	}

	redirect('/login')
}
