'use client'

import { createClient } from '@/utils/supabase/client'
import { useCallback, useEffect, useState } from 'react'
import Avatar from './Avatar'

export default function AccountForm({ user }) {
	const supabase = createClient()
	const [loading, setLoading] = useState(true)
	const [fullname, setFullname] = useState(null)
	const [username, setUsername] = useState(null)
	const [website, setWebsite] = useState(null)
	const [avatar_url, setAvatarUrl] = useState(null)

	const getProfile = useCallback(async () => {
		try {
			setLoading(true)

			const { data, error, status } = await supabase
				.from('profiles')
				.select(`full_name, username, website, avatar_url`)
				.eq('id', user?.id)
				.single()

			if (error && status !== 406) {
				throw error
			}

			if (data) {
				setFullname(data.full_name)
				setUsername(data.username)
				setWebsite(data.website)
				setAvatarUrl(data.avatar_url)
			}
		} catch (error) {
			alert('Error loading user data!')
		} finally {
			setLoading(false)
		}
	}, [user, supabase])

	useEffect(() => {
		getProfile()
	}, [user, getProfile])

	async function updateProfile({ username, website, avatar_url }) {
		try {
			setLoading(true)

			const { error } = await supabase.from('profiles').upsert({
				id: user?.id,
				full_name: fullname,
				username,
				website,
				avatar_url,
				updated_at: new Date().toISOString(),
			})
			if (error) throw error
			alert('Profile updated!')
		} catch (error) {
			alert('Error updating the data!')
		} finally {
			setLoading(false)
		}
	}

	async function handleSignOut() {
		try {
			await fetch('/auth/signout', {
				method: 'POST',
			})
			// Redirect to login after signout
			window.location.href = '/login'
		} catch (error) {
			console.error('Error signing out:', error)
			alert('Failed to sign out. Please try again.')
		}
	}

	return (
		<section className="bg-white flex justify-center items-center flex-col min-h-screen">
			<form className="w-full max-w-2xl">
				<div className="space-y-12">
					<div className="border-b border-gray-900/10 pb-12">
						<h2 className="text-base font-semibold leading-7 text-gray-900">
							Profile
						</h2>
						<p className="mt-1 text-sm leading-6 text-gray-600">
							This information will be displayed publicly so be careful what you
							share.
						</p>

						<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
							{/* AVATAR */}
							<div className="col-span-full">
								<label
									htmlFor="photo"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Photo
								</label>
								<Avatar
									uid={user?.id}
									url={avatar_url}
									size={150}
									onUpload={(url) => {
										setAvatarUrl(url)
										updateProfile({
											fullname,
											username,
											website,
											avatar_url: url,
										})
									}}
								/>
							</div>

							{/* EMAIL */}
							<div className="sm:col-span-4">
								<label
									htmlFor="email"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Email address
								</label>
								<div className="mt-2">
									<input
										id="email"
										name="email"
										type="email"
										value={user?.email}
										disabled
										autoComplete="email"
										className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							{/* FULL NAME */}
							<div className="sm:col-span-4">
								<label
									htmlFor="fullName"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Full Name
								</label>
								<div className="mt-2">
									<input
										id="fullName"
										name="fullName"
										type="text"
										value={fullname || ''}
										onChange={(e) => setFullname(e.target.value)}
										className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>

							{/* USERNAME */}
							<div className="sm:col-span-4">
								<label
									htmlFor="username"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Username
								</label>
								<div className="mt-2">
									<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-emerald-500">
										<input
											id="username"
											name="username"
											type="text"
											autoComplete="username"
											value={username || ''}
											onChange={(e) => setUsername(e.target.value)}
											className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>
							</div>

							{/* WEBSITE */}
							<div className="sm:col-span-4">
								<label
									htmlFor="website"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Website
								</label>
								<div className="mt-2">
									<input
										id="website"
										name="website"
										type="url"
										value={website || ''}
										onChange={(e) => setWebsite(e.target.value)}
										className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-6 flex items-center justify-end gap-x-6">
					<button
						type="button"
						className="text-sm font-semibold leading-6 text-gray-900"
						onClick={handleSignOut}
					>
						Sign out
					</button>
					<button
						type="submit"
						className="rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
						onClick={() =>
							updateProfile({ fullname, username, website, avatar_url })
						}
						disabled={loading}
					>
						{loading ? 'Loading ...' : 'Update'}
					</button>
				</div>
			</form>
		</section>
	)
}
