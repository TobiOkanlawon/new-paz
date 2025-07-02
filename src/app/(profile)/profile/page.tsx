'use client'
import React from 'react'
import styles from './profile.module.css'
import InputGroup from '@/components/InputGroup'
import SelectGroup from '@/components/InputGroup/SelectGroup'
import DateInput from '@/components/dateInput/page'
import ProgressBar from '@/components/ProgressBar'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import ProfileAlert from '@/components/ProfileAlert'
import Image from 'next/image'
import { useState } from 'react'

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];
const relationshipOptions = [
  { label: 'Father', value: 'father' },
  { label: 'Mother', value: 'mother' },
  { label: 'Brother', value: 'brother' },
  { label: 'Sister', value: 'sister' },
  { label: 'Other', value: 'other' },
];




const Profile = () => {
    const [formData, setFormData] = useState({
        postalAddress: '',
        birthday: '',
        gender: '',
        email: '',
        phoneNumber: '',
        nextOfKinFirstName: '',
        nextOfKinLastName: '',
        nextOfKinEmail: '',
        nextOfKinPhoneNumber: '',
        relationship: '',
    })
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [progress, setProgress] = useState(70);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [fileName, setFileName] = useState('myPhoto.png')

    const handleOpenModal = () => setIsModalOpen(true)
    const handleCloseModal = () => setIsModalOpen(false)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setFileName(file ? file.name : 'myPhoto.png')
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const [isActive, setIsActive] = useState(false)
  return (
    <>
        <ProfileAlert onClose={() => setIsActive(false)} isActive={false} isSuccessful={false} alertType={'Profile Photo'} />
        <form className={styles.container} id='CONTAINER'>
            <section className={styles.headers}>
                <div className={styles.profileContainer}>
                    <div className={styles.profileWrapper}>
                        <Image
                            src={"/profile.png"}
                            alt='Profile Image'
                            width={60}
                            height={60}
                        />
                    </div>
                    <div className={styles.editProfileWrapper}>
                        <Image
                            src={"/editProfile.png"}
                            alt='Profile Image'
                            width={18}
                            height={18}
                            onClick={handleOpenModal}
                        />
                    </div>
                </div>
                <div className={styles.progressWrapper}>
                    <ProgressBar progress={progress} />
                </div>
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} >
                    <h2 className={styles.modalHeader}>Change profile photo</h2>
                    <div className={styles.profileInputContainer}>
                        <label htmlFor="profileInput" className={styles.fakeButton}>
                            Choose File
                        </label>
                        <span className={styles.fileName}>{fileName}</span>
                        <input
                            type="file"
                            name="profileInput"
                            id="profileInput"
                            className={styles.profileInput}
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className={styles.buttonContainer}></div>
                    <Button
                    label="Submit"
                    loading={false}
                    className={styles.profileButton}
                    />
                    <p className={styles.back}> <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-move-left-icon lucide-move-left"><path d="M6 8L2 12L6 16"/><path d="M2 12H22"/></svg></span> Back</p>
            </Modal>
            </section>
            <section className={styles.form1}>
                <div>
                    <div className={styles.groupInputs}>
                        <InputGroup
                            label="Postal Address"
                            placeholder="Enter postal address here"
                            name="postalAddress"
                            type='text'
                            value={formData.postalAddress}
                            onChange={handleChange}
                            required
                            disabled={isSubmitted}
                        />
                        <DateInput
                            label="Birthday"
                            placeholder="Select Date"
                            name="birthday"
                            icon={<Image 
                                src={"/inputBirthday.png"} alt="Birthday"
                                width={20}
                                height={20} 
                            />}
                            type='date'
                            value={formData.birthday}
                            onChange={handleChange}
                            required
                            disabled={isSubmitted}
                        />
                    </div>
                    <div className={styles.groupInputs}>
                        <SelectGroup label="Gender" name="gender" options={genderOptions} placeholder='Select Date'/>
                        <InputGroup
                            label="Email"
                            placeholder="Enter email address"
                            name="email"
                            type='email'
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isSubmitted}
                        />
                    </div>
                    <div className={styles.groupInputs}>
                        <InputGroup
                            label="Phone Number"
                            placeholder="Enter your phone number"
                            name="phoneNumber"
                            type='tel'
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            disabled={isSubmitted}
                        />
                    </div>
                </div>
            </section>
            <section className={styles.form2}>
                <h3>Next of Kin Details</h3>
                <div>
                    <div className={styles.groupInputs}>
                        <InputGroup
                            label="First Name"
                            placeholder="Enter First Name"
                            name="nextOfKinFirstName"
                            type='text'
                            value={formData.nextOfKinFirstName}
                            onChange={handleChange}
                            required
                            disabled={isSubmitted}
                        />
                        <InputGroup
                            label="Last Name"
                            placeholder="Enter Last Name"
                            name="nextOfKinLastName"
                            type='text'
                            value={formData.nextOfKinLastName}
                            onChange={handleChange}
                            required
                            disabled={isSubmitted}
                        />
                    </div>
                    <div className={styles.groupInputs}>
                        <InputGroup
                            label="Email"
                            placeholder="Enter their email address"
                            name="nextOfKinEmail"
                            type='email'
                            value={formData.nextOfKinEmail}
                            onChange={handleChange}
                            required
                            disabled={isSubmitted}
                        />
                        <InputGroup
                            label="Phone Number"
                            placeholder="Enter their phone number"
                            name="nextOfKinPhoneNumber"
                            type='tel'
                            value={formData.nextOfKinPhoneNumber}
                            onChange={handleChange}
                            required
                            disabled={isSubmitted}
                        />
                    </div>
                    <div className={styles.groupInputs}>
                        <SelectGroup 
                            label="Relationship" 
                            name="Relationship" 
                            placeholder='Who is the person to you?'
                            options={relationshipOptions} 
                            value={formData.relationship}
                            onChange={handleChange}
                            required
                            disabled={isSubmitted} 
                        />
                    </div>
                </div>
            </section>
            <Button
                label="Submit"
                loading={false}
                className={styles.button}
                onClick={(e) => {
                    e.preventDefault();
                    setIsSubmitted(true);
                }}
                />
        </form>
    </>
  )
}

export default Profile