# Supabase Auth - Next.js Starter

<p>
  <a href="https://supabase.com">
    <img
      width="168"
      height="30"
      src="https://supabase.com/badge-made-with-supabase-dark.svg"
      alt="Made with Supabase"
    />
  </a>
</p>

> [!NOTE]
> This is a **modified version** of [Supabase Next.js Auth & User Management Starter](https://github.com/supabase/supabase/blob/master/examples/user-management/nextjs-user-management) by [Supabase](https://supabase.com).

This example enables users to sign up, sign in, and then view and update their account.

The app authenticates and identifies the user, and stores their profile information in the database.

## 👨‍💻 Technologies Used

- Frontend:
  - [Next.js](https://nextjs.org) - a React framework for building full-stack web applications.
  - [Tailwind](https://tailwindcss.com) - a utility-first CSS framework for rapidly building custom user interfaces.
  - [Supabase](https://supabase.com) - an open source Firebase alternative for user management and realtime data syncing.
- Backend:
  - [Supabase dashboard](https://supabase.com/dashboard) - hosted Postgres database with restful API for usage with Supabase.

## 🧞‍♂️ Commands

All commands are run from the root of the project, from a terminal:

| Command         | Action                                           |
| :-------------- | :----------------------------------------------- |
| `npm i`         | Installs dependencies                            |
| `npm run dev`   | to start Next.js in development mode             |
| `npm run build` | to build the application for production usage    |
| `npm start`     | to start a Next.js production server             |
| `npm run lint`  | to set up Next.js' built-in ESLint configuration |
| `npx next -h`   | to get a list of the available CLI commands      |

## 🚀 Getting Started

### Initialize a Next.js app

```zsh
npx create-next-app@latest supabase-auth-nextjs
```

```zsh
cd supabase-auth-nextjs
```

```zsh
npm i -D @tailwindcss/forms
```

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // ..
  plugins: [require('@tailwindcss/forms')],
}
```

```zsh
npm i @supabase/supabase-js @supabase/ssr @heroicons/react
```

### Create a Supabase project

[Create a new project](https://supabase.com/dashboard) in the Supabase Dashboard.

### Set up the database schema

1. Go to the [SQL Editor](https://supabase.com/dashboard/project/_/sql) page in the Dashboard.
2. Click **User Management Starter**.
3. Click **Run**.
4. Go to the [Table Editor](https://supabase.com/dashboard/project/_/editor) in the Dashboard and see the new `profiles` table.

### Get the API Keys

1. Go to the [API Settings](https://supabase.com/dashboard/project/_/settings/api) page in the Dashboard.
2. Find your Project `URL`, `anon`, and `service_role` keys on this page.

**_NOTE_**: The `service_role` key has full access to your data, bypassing any security policies. These keys have to be kept secret and are meant to be used in server environments and never on a client or browser.

```
// .env.local
NEXT_PUBLIC_SUPABASE_URL=<SUBSTITUTE_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUBSTITUTE_SUPABASE_ANON_KEY>
```

### Supabase utilities

```js
// src/utils/supabase/client.js
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
```

```js
// src/utils/supabase/server.js
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

### Next.js middleware

```js
// middleware.js
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request) {
  // update user's auth session
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

```js
// src/utils/supabase/middleware.js
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  await supabase.auth.getUser()

  return supabaseResponse
}
```

### Login and Signup form

```jsx
// src/app/login/page.jsx
import Link from 'next/link'
import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <main className='flex justify-center items-center h-screen bg-white'>
      <Link
        href='/'
        className='absolute left-8 top-8 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center group'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1'
        >
          <polyline points='15 18 9 12 15 6' />
        </svg>{' '}
        Back
      </Link>
      <section className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <img
            alt='Your Company'
            src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
            className='mx-auto h-10 w-auto'
          />
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            Sign in to your account
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form action='#' method='POST' className='space-y-6'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Email address
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  required
                  autoComplete='email'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Password
                </label>
                {/* <div className='text-sm'>
                  <a
                    href='#'
                    className='font-semibold text-indigo-600 hover:text-indigo-500'
                  >
                    Forgot password?
                  </a>
                </div> */}
              </div>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  required
                  autoComplete='current-password'
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div>
              <button
                formAction={login}
                type='submit'
                className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                Sign in
              </button>
            </div>
            <div>
              <button
                formAction={signup}
                type='submit'
                className='flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6  shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200 border-gray-200 border text-black'
              >
                Sign up
              </button>
            </div>
          </form>

          {/* <p className='mt-10 text-center text-sm text-gray-500'>
            Don't have an account yet?{' '}
            <a
              // href='/'
              className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500 cursor-pointer'
            >
              Start here
            </a>
          </p> */}
        </div>
      </section>
    </main>
  )
}
```

```js
// src/app/login/actions.js
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
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

export async function signup(formData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log('Signup error:', error) // Log the error to the console
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}
```

```jsx
// src/app/error/page.jsx
import Link from 'next/link'

export default function ErrorPage() {
  return (
    <main className='grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8 h-screen'>
      <Link
        href='/login'
        className='absolute left-8 top-8 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center group'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1'
        >
          <polyline points='15 18 9 12 15 6' />
        </svg>{' '}
        Back
      </Link>
      <section className='text-center'>
        {/* <p className="text-base font-semibold text-indigo-600">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1> */}
        <p className='mt-6 text-base leading-7 text-gray-600'>
          Sorry, something went wrong.
        </p>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <a
            href='/'
            className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
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
```

### Email template

1. Go to the [Auth templates](https://supabase.com/dashboard/project/_/auth/templates) page in your dashboard.
2. Select `Confirm signup` template.
3. Change `{{ .ConfirmationURL }}` to `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`.

### Confirmation endpoint

```js
// src/app/auth/confirm/route.js
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = '/account'

  // Create redirect link without the secret token
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (token_hash && type) {
    const supabase = createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      redirectTo.searchParams.delete('next')
      return NextResponse.redirect(redirectTo)
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = '/error'
  return NextResponse.redirect(redirectTo)
}
```

### Create an avatar upload widget

```jsx
// src/app/account/avatar.jsx
'use client'

import { createClient } from '@/utils/supabase/client'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Avatar({ uid, url, size, onUpload }) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState(url)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function downloadImage(path) {
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .download(path)
        if (error) {
          throw error
        }

        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }

    if (url) downloadImage(url)
  }, [url, supabase])

  const uploadAvatar = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert('Error uploading avatar!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='mt-2 flex items-center gap-x-3'>
      {avatarUrl ? (
        <Image
          width={size}
          height={size}
          src={avatarUrl}
          alt='Avatar'
          className='avatar image border'
          style={{ height: size, width: size }}
        />
      ) : (
        <UserCircleIcon
          aria-hidden='true'
          className='h-12 w-12 text-gray-300'
        />
      )}
      <div style={{ width: size }}>
        <button
          type='button'
          className='rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
          onClick={() => document.getElementById('avatar').click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading ...' : 'Change'}
        </button>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type='file'
          id='avatar'
          accept='image/*'
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
}
```

### Account page

```jsx
// src/app/account/account-form.jsx
'use client'

import { createClient } from '@/utils/supabase/client'
import { useCallback, useEffect, useState } from 'react'
import Avatar from './avatar'

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
    <section className='bg-white flex justify-center items-center flex-col min-h-screen'>
      <form className='w-full max-w-2xl'>
        <div className='space-y-12'>
          <div className='border-b border-gray-900/10 pb-12'>
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
              Profile
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              This information will be displayed publicly so be careful what you
              share.
            </p>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              {/* AVATAR */}
              <div className='col-span-full'>
                <label
                  htmlFor='photo'
                  className='block text-sm font-medium leading-6 text-gray-900'
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
              <div className='sm:col-span-4'>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Email address
                </label>
                <div className='mt-2'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    value={user?.email}
                    disabled
                    autoComplete='email'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              {/* FULL NAME */}
              <div className='sm:col-span-4'>
                <label
                  htmlFor='fullName'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Full Name
                </label>
                <div className='mt-2'>
                  <input
                    id='fullName'
                    name='fullName'
                    type='text'
                    value={fullname || ''}
                    onChange={(e) => setFullname(e.target.value)}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              {/* USERNAME */}
              <div className='sm:col-span-4'>
                <label
                  htmlFor='username'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Username
                </label>
                <div className='mt-2'>
                  <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600'>
                    <input
                      id='username'
                      name='username'
                      type='text'
                      autoComplete='username'
                      value={username || ''}
                      onChange={(e) => setUsername(e.target.value)}
                      className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                    />
                  </div>
                </div>
              </div>

              {/* WEBSITE */}
              <div className='sm:col-span-4'>
                <label
                  htmlFor='website'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Website
                </label>
                <div className='mt-2'>
                  <input
                    id='website'
                    name='website'
                    type='url'
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-6 flex items-center justify-end gap-x-6'>
          <button
            type='button'
            className='text-sm font-semibold leading-6 text-gray-900'
            onClick={handleSignOut}
          >
            Sign out
          </button>
          <button
            type='submit'
            className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
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
```

```jsx
// src/app/account/page.jsx
import { createClient } from '@/utils/supabase/server'
import AccountForm from './account-form'

export default async function Account() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <AccountForm user={user} />
}
```

### Sign out

```js
// src/app/auth/signout/route.js
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const supabase = createClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/login', req.url), {
    status: 302,
  })
}
```

### Run the application

```zsh
npm run dev
```

Open [https://localhost:3000](http://localhost:3000) with your browser to see the result.

## 👀 Resources

- [Supabase Auth](https://supabase.com/auth)
- [[Docs] Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Auth Example - Supabase Auth with Next.js](https://github.com/supabase/supabase/blob/master/examples/user-management/nextjs-user-management)
- [[Docs] Next.js User Management Quickstart](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
