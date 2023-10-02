import prisma from "@/lib/db";
import { unstable_cache as cache } from "next/cache";
import { Category } from "@prisma/client";
import { z } from "zod";

// Generate segments for [product] using the `params` passed from
// the parent segment's `generateStaticParams` function
export async function generateStaticParams({
  params
}: {
  params: { category: string };
}) {

  const category = params.category.toUpperCase();

  const threads = await cache(
    async () => {
      return prisma.thread.findMany({
        where: {
          category: category as (typeof Category)[keyof typeof Category],
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
