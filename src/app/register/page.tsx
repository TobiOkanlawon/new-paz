import React from 'react'
import styles from './register.module.css'
import Image from 'next/image'
import { FaArrowLeft, FaEyeSlash } from 'react-icons/fa'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const RegisterForm = dynamic(() => import('./RegisterForm'));


const register = () => {

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Image src={'/PAZLogo.png'} alt="Logo" width={127} height={42.61} className={styles.logo} />
        <div className={styles.leftContainer}>
            <Image src={'/lightbulb.png'} alt="light bulb" width={52.5} height={52.5} className={styles.lightbulb} />
            <p>S.L.I.D.E. with PAZ</p>
            <h1>Tips on becoming financially stable all year round!</h1>
        </div>
        <div className={styles.spacer}></div>
        <Image src={'/Arrow.png'} alt="Arrow" width={151} height={212} className={styles.arrow} />
        <Image src={'/Money.png'} alt="Money" width={110} height={152} className={styles.money} />
        <Image src={'/Coin.png'} alt="Coin" width={142} height={157} className={styles.coin} />
        <Image src={'/target.png'} alt="Target" width={110} height={140} className={styles.target} />
      </div>
      <RegisterForm />
      {/* <div className={styles.right}>
        <h3>Create a secure account</h3>
        <form className={styles.form}>
          <Input
           label="Email Address" 
           type="email" 
           placeholder="Enter your email address" 
           name="email" 
           id="email" 
          />
          <Input 
          label="Password" 
          type="password" 
          placeholder="Enter your password" 
          name="password" 
          id="password"
          />
          <Input 
          label="Re - Password" 
          type="password" 
          placeholder="Enter the password you entered in the box above" 
          name="confirmPassword" 
          id="confirmPassword" 
          />
          <p>By clicking “Sign up”, I agree to PAZ’s <a href="#">privacy policy</a> and <a href="#">terms of service</a>.</p>
          <Button 
          type="submit" 
          className={styles.register} 
          label="Create accounts">
            Create Account
          </Button>
        </form>
        <Link href="/login"><FaArrowLeft className={styles.arrowLeft}/> Return to Log in </Link>
      </div> */}
      <div className={styles.mobile}>
        <Image src={'/PAZLogo2.png'} alt="Logo" width={104} height={34.76} className={styles.logo} />
        <div className={styles.mobileContainer}>
            <h3>Create a secure account</h3>
            <form action="GET" className={styles.form}>
              <Input label="Email Address" type="email" placeholder="Enter your email address" name="email" id="email" />
              <Input label="Password" type="password" placeholder="Enter your password" name="password" id="password"/>
              <Input label="Re - Password" type="password" placeholder="Enter the password you entered in the box above" name="confirmPassword" id="confirmPassword" />
                <p>By clicking “Sign up”, I agree to PAZ’s <a href="#">privacy policy</a> and <a href="#">terms of service</a>.</p>
                <Button type="submit" className={styles.register} label="Create accounts">Create Account</Button>

            </form>
            <Link href="/login"><FaArrowLeft/> Return to Log in </Link>
            </div>
        </div>
    </div>
  )
}

export default register