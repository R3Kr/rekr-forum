"use client"
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import React from 'react'

export default function Page() {
    const {data} = useSession()

    if (!data){
        redirect("api/auth/signin")
    }

  return (
    <>
    <div>{data.user.id}</div>
    <div>{data.user?.name}</div>
    <div>{data.user?.email}</div>
    <div>{data.user?.image}</div>
    </>
  )
}
