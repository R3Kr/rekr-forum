import prisma from "@/lib/db";
import { unstable_cache as cache } from "next/cache";
import { Category } from "@prisma/client";
import { z } from "zod";
import { Box, Flex, Stack, Text } from "@chakra-ui/react";

// Generate segments for [product] using the `params` passed from
// the parent segment's `generateStaticParams` function
// export async function generateStaticParams({
//   params,
// }: {
//   params: { category: string };
// }) {
//   console.log(params.category);
//   //const category = params.category.toUpperCase();
//   let category = params.category;
//   if (category) {
//     category = params.category.toUpperCase();
//   }

//   const threads = await cache(
//     async () => {
//       return prisma.thread.findMany({
//         where: {
//           category: category as (typeof Category)[keyof typeof Category],
//         },
//       });
//     },
//     [category],
//     {
//       revalidate: 10,
//     }
//   )();

//   return threads.map((t) => ({ thread: t.id.toString() }));
// }

import React, { Suspense } from "react";
import CreatePost from "@/components/CreatePost";
import { redirect } from "next/navigation";
import { getPostsAndUser } from "@/app/actions";

export default async function Page({ params }: { params: { thread: string } }) {
  const threadId = z.number().parse(Number(params.thread));

  const posts = await cache(
    async () => {
      return getPostsAndUser(threadId);
    },
    [params.thread + "posts"],
    { tags: [params.thread] }
  )();

  const thread = await cache(
    async () => {
      return prisma.thread.findFirst({
        where: {
          id: threadId,
        },
      });
    },
    [params.thread],
    { revalidate: false }
  )();

  if (!thread) {
    redirect("/");
  }

  posts.forEach((p) => console.log(p));

  return (
    <Suspense fallback="loading..">
      <CreatePost thread={thread} posts={posts}></CreatePost>
    </Suspense>
  );
}
