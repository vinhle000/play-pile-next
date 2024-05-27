import {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import userService from '@/services/userService'
import  UserContext  from '@/contexts/UserContext'
import { TailSpin } from 'react-loader-spinner'

function HomePage() {

  const { user, loading } = useContext(UserContext)
  const navigate  = useNavigate()

  // FIXME: For now, If user is not logged in, redirect to login page
  // In place until Landing/Hero page is implemented
  // for now /board as the page to go to immediately after login
  if (!user) {
    navigate('/login')
  } else {
    navigate('/board')
  }


  return (
    <div className="container mx-auto">
      {/* <h1 className="text-3x1 font-bold"> Home </h1> */}
    </div>
  )
}

export default HomePage;