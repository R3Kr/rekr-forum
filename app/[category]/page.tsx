import { Category } from "@prisma/client";
import { Box } from "@chakra-ui/react";
import { unstable_cache as cache } from "next/cache";
import prisma from "@/lib/db";
import Link from "next/link";

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
    <>
      {threads.map((t) => (
        <>
          <Link key={t.id} href={`/${params.category}/${t.id}`}>
            {t.title}
          </Link>
          <br></br>
        </>
      ))}
    </>
  );
}
