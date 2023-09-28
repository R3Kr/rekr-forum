"use client"
import { Box, Center, SimpleGrid, useColorModeValue } from "@chakra-ui/react";


export default function Forum() {
  return (
    <Box bg={useColorModeValue("aquamarine", "gray")} h="1000px" color="black" px={20}>
      <SimpleGrid columns={{sm: 1, md: 2}} spacing={10}>
        <Box bg="tomato" height="80px"></Box>
        <Box bg="tomato" height="80px"></Box>
        <Box bg="tomato" height="80px"></Box>
        <Box bg="tomato" height="80px"></Box>
        <Box bg="tomato" height="80px"></Box>
      </SimpleGrid>
    </Box>
  );
}