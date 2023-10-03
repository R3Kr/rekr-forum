"use client";
import Card from "./Card";
import { useState } from "react";
import { Category } from "@prisma/client";
import { Link } from "@chakra-ui/next-js";
import { Box, Stack, Button } from "@chakra-ui/react";

interface Props {
  categories: string[];
}

export default function Forum({ categories }: Props) {
  return (
    <Stack gap={3} mt={2}>
      {categories.map((c) => (
        <Button as={Link} key={c} fontSize={20} href={`/${c.toLowerCase()}`}>
          {c}
        </Button>
      ))}
    </Stack>
  );
}
