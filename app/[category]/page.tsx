import { Category } from "@prisma/client";
import { Box, Button, Flex, Spacer } from "@chakra-ui/react";
import { unstable_cache as cache } from "next/cache";
import prisma from "@/lib/db";
import Link from "next/link";
import CreateThread from "@/components/CreateThread";
import Thread from "@/components/Thread";
import { getThreadsAndUser } from "../actions";
import { useBreakpointValue } from "@chakra-ui/react";
import ThreadPage from "@/components/ThreadPage";

export async function generateStaticParams() {
  return Object.keys(Category)
    .filter((v) => isNaN(Number(v)))
    .map((s) => ({ category: s }));
}

export default async function Page({
  params,
}: {
  params: { category: string };
}) {
  //DEBUG
  // const p = await generateStaticParams();
  // console.log(p);
  // console.log(await gsp({ params: p[0] }));

  const category = params.category.toUpperCase();

  const threads = await cache(
    async () => {
      return getThreadsAndUser(
        category as (typeof Category)[keyof typeof Category]
      );
    },
    [category],
    {
      tags: [category],
    }
  )();

  return (
    <ThreadPage
      threads={threads}
      category={category as (typeof Category)[keyof typeof Category]}
    ></ThreadPage>
  );
}
