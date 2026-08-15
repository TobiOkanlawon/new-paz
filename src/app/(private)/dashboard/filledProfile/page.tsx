'use client'

import React, { useRef, useState } from 'react'
import TextGroup from '@/components/TextGroup'
import Image from 'next/image'
import styles from './filledPage.module.css'
import { uploadProfileImageAction } from '@/actions/uploadProfileImage'
import { saveProfile } from '@/actions/profile'
import { useSession } from 'next-auth/react'
import useUser from '@/store/userStore'

const FilledState = () => {
  const { data: session } = useSession()
  const profileImage = useUser((state) => state.profileImage)
  const setProfileImage = useUser((state) => state.setProfileImage)

  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', session?.user?.email ?? 'user')

      const result = await uploadProfileImageAction(formData)

      if (result.success && result.imageUrl) {
        const updatedProfile = await saveProfile({ profileImage: result.imageUrl })
        if (!updatedProfile.success) throw new Error(updatedProfile.error)
        setProfileImage(result.imageUrl)
      } else {
        setUploadError(result.success ? 'Upload succeeded but returned no image URL' : result.error || 'Upload failed')
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className={styles.container}>

        <header className={styles.header}>
            <div
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload profile image"
            >
              <Image
                src={profileImage}
                alt='Profile Image'
                width={112}
                height={112}
                priority
                quality={85}
              />
              {isUploading && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                  }}
                >
                  <span style={{ color: 'white', fontSize: '12px' }}>Uploading...</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                disabled={isUploading}
              />
            </div>
            <p>Biodun Olowo</p>
            {uploadError && (
              <p style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>
                {uploadError}
              </p>
            )}
        </header>
        <main>
            <div>
                <div className={styles.textGroupContainer}>
                    <TextGroup
                        header= {'Postal Address'}
                        texts = {'8, Agbaoku street, Opebi Lagos'}
                    />
                    <TextGroup
                        header= {'Date Of Birth'}
                        texts = {'Jan 1st, 2023'}
                    />
                </div>
                <div className={styles.textGroupContainer}>
                    <TextGroup
                        header= {'Gender'}
                        texts = {'Male'}
                    />
                    <TextGroup
                        header= {'Email'}
                        texts = {'abiodunfromlondon@gmail.com'}
                    />
                </div>
                <div>
                    <TextGroup
                        header= {'Phone Number'}
                        texts = {'0701 234 5678'}
                    />
                </div>
            </div>
            <div>
                <div>
                    <h2>Next Of Kin Details</h2>
                </div>
                <div className={styles.textGroupContainer}>
                    <TextGroup
                        header= {'First Name'}
                        texts = {'Sade'}
                    />
                    <TextGroup
                        header= {'Last Name'}
                        texts = {'Olowo'}
                    />
                </div>
                <div className={styles.textGroupContainer}>
                    <TextGroup
                        header= {'Email'}
                        texts = {'sadeaiyabiodun@gmail.com'}
                    />
                    <TextGroup
                        header= {'Phone Number'}
                        texts = {'0801 234 5678'}
                    />
                </div>
                <div>
                    <TextGroup
                        header= {'Relationship'}
                        texts = {'Spouse'}
                    />
                </div>
            </div>
        </main>
    </div>
  )
}

export default FilledState
