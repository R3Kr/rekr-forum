import Forum from "@/components/Forum";
import { Category } from "@prisma/client";
import { Link } from "@chakra-ui/next-js";
import { Box, Stack, Button } from "@chakra-ui/react";

const categories = Object.keys(Category).filter((v) => isNaN(Number(v)));

export default async function Home() {
  return <Forum categories={categories}></Forum>;
}
