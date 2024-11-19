'use client'

import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

export default function ResetPasswordPage() {
	const supabase = createClient()

	/**
	 * Step 2: Once the user is redirected back to application,
	 * ask the user to reset their password.
	 */
	useEffect(() => {
		supabase.auth.onAuthStateChange(async (event, session) => {
			if (event == 'PASSWORD_RECOVERY') {
				const newPassword = prompt(
					'What would you like your new password to be?'
				)
				const { data, error } = await supabase.auth.updateUser({
					password: newPassword,
				})

				if (data) alert('Password updated successfully!')
				if (error) alert('There was an error updating your password.')
			}
		})
	}, [supabase.auth])

	return (
		<main className="flex justify-center items-center h-screen bg-white">
			<Link
				href="/forgotPassword"
				className="absolute left-8 top-8 rounded-md bg-emerald-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 flex items-center group"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
				>
					<polyline points="15 18 9 12 15 6" />
				</svg>{' '}
				Back
			</Link>
			<section className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<Image
						alt="Your Company"
						src="https://tailwindui.com/plus/img/logos/mark.svg?color=emerald&shade=500"
						className="mx-auto h-10 w-auto"
						width={40}
						height={40}
						unoptimized
					/>
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
						Reset password
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm flex items-center justify-center">
					<a
						href="/account"
						className="rounded-md bg-emerald-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
					>
						Proceed to account
					</a>
				</div>
			</section>
		</main>
	)
}
