"use client";
import { Box, Center, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import Card from "./Card";
import { useState } from "react";

interface Props {
  pposts: string[];
}

export default function Forum({ pposts }: Props) {
  let [posts, setPosts] = useState(pposts);
  console.log(posts);

  return (
    <Box
      bg={useColorModeValue("aquamarine", "gray")}
      h="1000px"
      color="black"
      px={20}
    >
      <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={10}>
        {posts.map((p) => (
          <Card
            key={p}
            onClick={() =>
              setPosts((posts) => posts.filter((post) => post !== p))
            }
          >
            {p}
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}
