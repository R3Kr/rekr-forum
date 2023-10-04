import React from "react";
import prisma from "@/lib/db";
import { unstable_cache as cache } from "next/cache";
import Thread from "@/components/Thread";
import { Stack } from "@chakra-ui/react";

export default async function Page() {
  const threads = await cache(
    async () => {
      return prisma.thread.findMany({
        take: 10,
        orderBy: {
          comments: {
            _count: "desc",
          },
        },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });
    },
    ["topthreads"],
    {
      revalidate: 3600,
    }
  )();

  return (
    <Stack gap={5}>
      {threads.map((t) => (
        <Thread thread={t} key={t.id}></Thread>
      ))}
    </Stack>
  );
}
