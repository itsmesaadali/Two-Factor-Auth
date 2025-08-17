import React, { Suspense } from 'react'
import ForgotPassword from './_forgotpassword'

const Page = () => {
  return (
    <div>
      <Suspense>
        <ForgotPassword/>
      </Suspense>
    </div>
  )
}

export default Page
