'use server'

import { getURL } from '@/utils/supabase/getURL'
import { createClient } from '@/utils/supabase/server'
// import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signup(formData) {
	const supabase = createClient()

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get('email'),
		password: formData.get('password'),
	}

	const { error } = await supabase.auth.signUp(data, {
		redirectTo: `${getURL()}`,
	})

	if (error) {
		console.log('Signup error:', error)
		redirect('/error')
	}

	// revalidatePath('/', 'layout')
	redirect('/confirmation')
}
