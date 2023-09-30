"use client";
import { Box, Center, SimpleGrid, useColorModeValue } from "@chakra-ui/react";

interface Props {
  posts: string[];
}

export default function Forum({posts}: Props) {
  return (
    <Box
      bg={useColorModeValue("aquamarine", "gray")}
      h="1000px"
      color="black"
      px={20}
    >
      <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={10}>
        {posts.map(p => <Box key={p} bg="tomato" height="80px">{p}</Box>)}
        
      </SimpleGrid>
    </Box>
  );
}
