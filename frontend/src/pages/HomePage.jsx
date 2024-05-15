import {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import userService from '@/services/userService'
import  UserContext  from '@/contexts/UserContext'
import { TailSpin } from 'react-loader-spinner'

function HomePage() {

  const { user, loading } = useContext(UserContext)
  const navigate  = useNavigate()
  const handleOnChange = (e) => {
    console.log("Button Clicked")
    console.log(document.cookie);
    console.log('MY INFO', e.target.value)
    userService.getUserInfo()
      .then((response) => {
        console.log(response)
      }).catch((error) => {
        console.error('Error getting user info', error)
      })
  }
  if (loading) {
    return <TailSpin color='black' radius='1rem' />
  }

  // FIXME: For now, If user is not logged in, redirect to login page
  // In place until Landing/Hero page is implemented
  if (!user) {
    navigate('/login')
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3x1 font-bold"> Home </h1>
    </div>
  )
}

export default HomePage;