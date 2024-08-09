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
