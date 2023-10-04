"use client";
import React from "react";
import { Thread } from "@prisma/client";
import { Link } from "@chakra-ui/next-js";
import { Text, Button, Flex } from "@chakra-ui/react";
import Image from "next/image";

interface Props {
  thread: Thread & {
    author: {
      name: string | null;
      image: string | null;
    } | null;
  };
}

export default function Thread({ thread }: Props) {
  return (
    <Flex as={Link} href={`/${thread.category}/${thread.id}`}>
      <Button key={thread.id}>
        {`${thread.title} | ${thread.author?.name}`}
      </Button>
      <Image
        src={thread.author?.image ? thread.author?.image : "/bruh.jpg"}
        alt="profile pic"
        width={40}
        height={40}
      ></Image>
      <Text>{thread.createdAt.toLocaleString()}</Text>
    </Flex>
  );
}
