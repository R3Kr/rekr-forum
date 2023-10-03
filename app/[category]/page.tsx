import { Category } from "@prisma/client";
import { Box, Button, Flex, Spacer } from "@chakra-ui/react";
import { unstable_cache as cache } from "next/cache";
import prisma from "@/lib/db";
import Link from "next/link";
import CreateThread from "@/components/CreateThread";

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

  return (
    <Flex>
      <Box>
        {threads.map((t) => (
          <>
            <Button as={Link} key={t.id} href={`/${params.category}/${t.id}`}>
              {t.title}
            </Button>
            <br></br>
          </>
        ))}
      </Box>
      <Spacer/>
      <CreateThread category={category as (typeof Category)[keyof typeof Category]}></CreateThread>
    </Flex>
  );
}
