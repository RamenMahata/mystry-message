'use client'
// This file is part of the Next.js Auth example.
// It is used to demonstrate how to use NextAuth.js for authentication in a Next.js application.
// It includes a sign-in page that allows users to sign in or sign out.
import React from "react"

import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}