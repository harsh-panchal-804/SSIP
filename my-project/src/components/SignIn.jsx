import React from 'react'
import { SignIn as ClerkSignIn } from '@clerk/clerk-react'

const SignIn = () => {
  return (
    <div className='h-full w-full flex items-center justify-center my-19 py-20 bg-base-400/90'>
      <ClerkSignIn path="/signin" routing="path"  />
    </div>
  )
}

export default SignIn
