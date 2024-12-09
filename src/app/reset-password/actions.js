'use server'

import { getURL } from '@/utils/supabase/getURL'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function resetPassword(formData) {
	const supabase = createClient()

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const password = formData.get('password')

	const { error } = await supabase.auth.updateUser(password, {
		redirectTo: `${getURL()}`,
	})

	if (error) {
		console.log('Reset password error:', error)
		redirect('/error')
	}

	revalidatePath('/', 'layout')
	redirect('/login')
}
