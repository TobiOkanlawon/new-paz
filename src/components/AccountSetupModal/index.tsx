import React from 'react'
import styles from './asm.module.css'
import Modal from '../Modal'
import Image from 'next/image'
import { LuUserRoundPlus, LuHash } from 'react-icons/lu'
import Button from '../Button'
import useUser from "@/store/userStore";

interface ASMProps {
    isOpen: boolean,
    onClose: () => void,
    handleBVNMopen: () => void,
    handleACMopen: () => void,
}
const SetupModal: React.FC<ASMProps> = ({isOpen, onClose, handleBVNMopen, handleACMopen}) => {

    const {user} = useUser()

  return (
    <div className={styles.container}>
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.modalHeader}>
                <h2>Welcome</h2>
                <Image src={'/confettiBall.png'} alt='' width={45} height={45}/>
            </div>
            <p className={styles.modalDescription}>Just a few more steps to setup your account</p>
            <div className={styles.addAccount}>
                <LuUserRoundPlus/>
                <p>Add Account</p>
                <Button onClick={handleACMopen}>
                    Add Account
                </Button>
            </div>
            <div className={styles.addBVN}>
                <LuHash/>
                <p>Add BVN</p>
                {
                    !user?.is_bvn_verified ? (
                        <Button onClick={handleBVNMopen} >
                            Add BVN
                        </Button>
                    ) : (
                        <p className={styles.success}>Verified</p>
                    )
                }
            </div>
        </Modal>
    </div>
  )
}

export default SetupModal