import React, { Suspense } from 'react'
import ResetPassword from './_resetpassword'

const Page = () => {
  return (
    <div>
      <Suspense>
        <ResetPassword/>
      </Suspense>
    </div>
  )
}

export default Page
