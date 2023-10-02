import prisma from "@/lib/db";
import { unstable_cache as cache } from "next/cache";
import { Category } from "@prisma/client";
import { z } from "zod";

// Generate segments for [product] using the `params` passed from
// the parent segment's `generateStaticParams` function
export async function generateStaticParams({
  params: { category },
}: {
  params: { category: (typeof Category)[keyof typeof Category] };
}) {
  const threads = await cache(
    async () => {
      return prisma.thread.findMany({
        where: {
          category: category,
        },
      });
    },
    [category],
    {
      revalidate: 10,
    }
  )();

  return threads.map((t) => ({ thread: t.id.toString() }));
}

import React from "react";

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

  return <div>{posts.map((p) => p.content)}</div>;
}
