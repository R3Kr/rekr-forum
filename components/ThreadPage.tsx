"use client"
import React from 'react'
import { Flex, Box, Spacer, useBreakpointValue} from '@chakra-ui/react'
import CreateThread from './CreateThread'
import { Category} from '@prisma/client'
import { getThreadsAndUser } from '@/app/actions'
import Thread from './Thread'


interface Props{
  threads: Awaited<ReturnType<typeof getThreadsAndUser>>
  category?: (typeof Category)[keyof typeof Category]
}

export default function ThreadPage({threads, category}: Props) {
  return (
    <Flex flexDirection={useBreakpointValue({base: "column", md: "row"})}>
      <Box>
        {threads.map((t) => (
          <>
            <Thread thread={t}></Thread>
            <br></br>
          </>
        ))}
      </Box>
      <Spacer />
      <CreateThread
        category={category as (typeof Category)[keyof typeof Category]}
      ></CreateThread>
    </Flex>
  )
}
