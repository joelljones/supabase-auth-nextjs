import Image from 'next/image'
import Link from 'next/link'
import { resetPassword } from './actions'

export default function ResetPasswordPage() {
	return (
		<main className="flex justify-center items-center h-screen bg-white">
			<Link href="/forgot-password" className="absolute left-8 top-8 ...">
				{/* Back button SVG */}
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

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form className="space-y-6">
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium leading-6 text-gray-900"
							>
								New Password
							</label>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									required
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<button
							formAction={resetPassword}
							type="submit"
							className="flex w-full justify-center rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
						>
							Update password
						</button>
					</form>
				</div>
			</section>
		</main>
	)
}