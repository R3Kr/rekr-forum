import prisma from "@/lib/db";
import { unstable_cache as cache } from "next/cache";
import { Category } from "@prisma/client";
import { z } from "zod";
import { Box, Flex, Stack, Text} from "@chakra-ui/react";

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

import React from "react";
import CreatePost from "@/components/CreatePost";

export default async function Page({ params }: { params: { thread: string } }) {
  const thread = z.number().parse(Number(params.thread));

  const posts = await cache(
    async () => {
      return prisma.post.findMany({
        where: {
          threadId: thread,
        },
      });
    },
    [params.thread],
    { revalidate: 10 }
  )();

  return (
    <Stack p={10}>
      <Text as={"h1"} fontSize={"7xl"}>Test</Text>
      {posts.map((p) => (
        <Box key={p.id}>{p.content}</Box>
      ))}
      <CreatePost threadId={thread}></CreatePost>
    </Stack>
  );
}
