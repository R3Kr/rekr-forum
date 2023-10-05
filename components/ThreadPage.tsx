"use client";
import React from "react";
import {
  Flex,
  Box,
  Spacer,
  useBreakpointValue,
  Button,
  HStack,
} from "@chakra-ui/react";
import CreateThread from "./CreateThread";
import { Category } from "@prisma/client";
import { getThreadsAndUser } from "@/app/actions";
import Thread from "./Thread";
import { useSubscription } from "@/app/SubscriptionProvider";

interface Props {
  threads: Awaited<ReturnType<typeof getThreadsAndUser>>;
  category?: (typeof Category)[keyof typeof Category];
}

export default function ThreadPage({ threads, category }: Props) {
  const { addSub, removeSub, isSubbed } = useSubscription();

  return (
    <Flex flexDirection={useBreakpointValue({ base: "column", md: "row" })}>
      <Box>
        {threads.map((t) => (
          <>
            <HStack>
              <Thread thread={t}></Thread>
              <Button
                onClick={() => {
                  isSubbed(t.id) ? removeSub(t.id) : addSub(t.id);
                }}
                bg={isSubbed(t.id) ? "red.400" : "green.400"}
              >
                {isSubbed(t.id) ? "Unsubscribe" : "Subscribe"}
              </Button>
            </HStack>
            <br></br>
          </>
        ))}
      </Box>
      <Spacer />
      <CreateThread
        category={category as (typeof Category)[keyof typeof Category]}
      ></CreateThread>
    </Flex>
  );
}
