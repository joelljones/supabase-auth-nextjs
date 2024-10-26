'use server'

import { getURL } from '@/utils/supabase/getURL'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// SIGNUP
export async function signup(formData) {
	const supabase = createClient()

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get('email'),
		password: formData.get('password'),
	}

	// const { error } = await supabase.auth.signUp(data)

	// REDIRECT URL FOR LOCAL DEVELOPMENT
	console.log('Redirecting to:', getURL())
	const { error } = await supabase.auth.signUp(data, {
		options: {
			redirectTo: getURL(),
		},
	})

	if (error) {
		console.log('Signup error:', error) // Log the error to the console
		redirect('/error')
	}

	// revalidatePath('/', 'layout')
	// redirect('/account')
	redirect('/confirmation')
}

// LOGIN
export async function login(formData) {
	const supabase = createClient()

	const data = {
		email: formData.get('email'),
		password: formData.get('password'),
	}

	const { error } = await supabase.auth.signInWithPassword(data)

	if (error) {
		console.log('Login error:', error) // Log the error to the console
		redirect('/error')
	}

	revalidatePath('/', 'layout')
	redirect('/account')
}
