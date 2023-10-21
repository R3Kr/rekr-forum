import React, { Suspense } from "react";
import prisma from "@/lib/db";
import { unstable_cache as cache } from "next/cache";
import Thread from "@/components/Thread";
import { Stack } from "@chakra-ui/react";
import ThreadPage from "@/components/ThreadPage";

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
    <Suspense fallback="loading..">
      <ThreadPage threads={threads}></ThreadPage>
    </Suspense>
  );
}
