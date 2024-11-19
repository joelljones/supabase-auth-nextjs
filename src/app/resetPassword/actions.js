'use server'

import { createClient } from '@/utils/supabase/server'
// import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// RESET PASSWORD
export async function forgotPassword(formData) {
	const supabase = createClient()

	// type-casting here for convenience
	// in practice, you should validate your inputs
	// Get the new password from formData
	const new_password = formData.get('password')

	const { data, error } = await supabase.auth.updateUser({
		password: new_password,
	})

	if (error) {
		console.log('Reset password error:', error) // Log the error to the console
		redirect('/error')
	}

	// revalidatePath('/', 'layout')
	// redirect('/account')
	redirect('/confirmation')
}
