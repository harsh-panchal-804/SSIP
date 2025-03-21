import React, { useState } from 'react'
import { Mail, Lock, EyeOff, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
const MainContent = () => {
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  NProgress.configure({
    easing: 'ease',
    speed: 1

  });

  const handleSubmit = async (e) => {
    
  }
  return (
    <div className='h-screen w-screen grid lg:grid-cols-2 '>
      <div className='flex items-center  justify-center'>
        <div className='flex flex-col gap-5 items-center  h-[100%] w-[100%] justify-center py-6 px-4 bg-primary'>
          <div className='h-[70%] w-[70%]  px-2 py-2 items-center justify-center flex-col'>
            

          </div>
        </div>

      </div>
     

    </div>
  )
}

export default MainContent