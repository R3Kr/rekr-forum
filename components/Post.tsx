import React from "react";
import { Button, Flex, Text, Stack} from "@chakra-ui/react";
import { getPostsAndUser } from "@/app/actions";
import Image from "next/image";

// type ItemType<T extends any[]> = T extends (infer R)[] ? R : any;

// interface Props {
//   post: ItemType<Awaited<ReturnType<typeof getPostsAndUser>>>;
// }

export interface PostProps {
  content: string;
  author?: string;
  authorUrl?: string;
  createdAt: Date;
}

export default function Post(post: PostProps) {
  return (
    <Stack>
      <Text>{`${post.content}`}</Text>

      <Image
        src={post.authorUrl ? post.authorUrl : "/bruh.jpg"}
        alt="profile pic"
        width={20}
        height={20}
      ></Image>
      <Text>{`made by: ${post.author ? post.author : "[REDACTED]"} |  ${post.createdAt.toString()}`}</Text>
      <Text>--------------------------------------</Text>
      <br></br>

    </Stack>
  );
}
