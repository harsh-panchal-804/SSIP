import React from 'react'
import Button1 from './Button1'
import ThemeOptions from './ThemeOptions'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

const NavBar = () => {
  const navItems = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'FAQ`s', path: '/faqs' },
    { name: 'Services', path: '/services' },
    { name: 'Sign In', path: '/signin' },
  ];

  return (
    <div className='flex justify-center'>
      <nav className='flex bg-base-200/60 backdrop-blur-sm z-40 justify-between fixed top-0 mt-3 items-center w-[70%] py-3 rounded-xl'>
        <div className='flex justify-center pl-7 font-thin text-2xl items-center'>
          <Link to="/">
          NavBar
          </Link>
        </div>
        <div className='flex justify-center items-center font-light text-xl pr-7'>
          <ul className='flex justify-center items-center space-x-10'>
            {navItems.map((item) => {
              if (item.path === "/signin") { return (
                <>
                <SignedOut>
                  <li key={item.name} className="group relative cursor-pointer">
                  <Link to={item.path}>
                    {item.name}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>

                  </li>
                </SignedOut>
                <SignedIn>
                  {}
                </SignedIn>
                </>
              )
               }
              else return (
                <li key={item.name} className="group relative cursor-pointer">
                  <Link to={item.path}>
                    {item.name}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              )
            })}
            <li className="group relative cursor-pointer">
              <div className="dropdown dropdown-bottom dropdown-end">
                <div tabIndex={0} role="button">
                  <Button1 text="Themes" />
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-[60vw] p-2 shadow-sm">
                  <ThemeOptions />
                </ul>
              </div>
            </li>
            <li className="group relative cursor-pointer">
              <UserButton />
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default NavBar;
