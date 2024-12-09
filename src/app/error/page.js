import Link from 'next/link'

export const metadata = {
	title: 'Error - Supabase Auth - Next.js',
	description: 'Something went wrong',
}

export default function ErrorPage() {
	return (
		<main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8 h-screen">
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
				<p className="mt-6 text-base leading-7">Sorry, something went wrong.</p>
				<div className="mt-10 flex items-center justify-center gap-x-6">
					<Link
						href="/"
						className="rounded-md bg-emerald-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
					>
						Go back home
					</Link>
				</div>
			</section>
		</main>
	)
}
