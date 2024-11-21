import Link from 'next/link'

export const metadata = {
	title: 'Confirmation - Supabase Auth - Next.js',
	description: 'Confirmation email has been sent to your email address',
}

export default function ConfirmationPage() {
	return (
		<main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8 h-screen">
			<Link
				href="/login"
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
			<section className="text-center">
				{/* <p className="text-base font-semibold text-emerald-500">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1> */}
				<p className="mt-6 text-base leading-7 text-gray-600">
					A confirmation email has been sent to your email address.
				</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<a
						href="/"
						className="rounded-md bg-emerald-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
					>
						Go back home
					</a>
					{/* <a href="#" className="text-sm font-semibold text-gray-900">
              Contact support <span aria-hidden="true">&rarr;</span>
            </a> */}
				</div>
			</section>
		</main>
	)
}
