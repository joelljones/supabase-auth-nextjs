'use server'

import { getURL } from '@/utils/supabase/getURL'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function forgotPassword(formData) {
	const supabase = createClient()

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const email = formData.get('email')

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${getURL()}`,
	})

	if (error) {
		console.log('Forgot password error:', error)
		redirect('/error')
	}

	revalidatePath('/', 'layout')
	redirect('/confirmation')
}
