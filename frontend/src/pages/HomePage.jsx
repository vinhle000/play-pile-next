import React from 'react'
import { Button } from '@/components/ui/button'
import userService from '@/services/userService'

function HomePage() {

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

  return (
    <div className="container mx-auto">
      <h1 className="text-3x1 font-bold"> HomePage </h1>
      <Button onClick={handleOnChange}>Click Me</Button>
    </div>
  )
}

export default HomePage;