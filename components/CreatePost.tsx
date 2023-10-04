"use client";
import { createPost } from "@/app/actions";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Stack,
  Textarea,
  Box,
  Text,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";

import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Thread } from "@prisma/client";
import { useSession } from "next-auth/react";
//import Link from "next/link";
import { Link } from "@chakra-ui/next-js";
import { getPostsAndUser } from "@/app/actions";
import Post, { PostProps } from "./Post";

type ItemType<T extends any[]> = T extends (infer R)[] ? R : any;

interface Props {
  thread: Thread;
  posts: Awaited<ReturnType<typeof getPostsAndUser>>;
}

function postToPostProps(
  p: ItemType<Awaited<ReturnType<typeof getPostsAndUser>>>
): PostProps {
  const returnVal: PostProps = {
    content: p.content,
    createdAt: p.createdAt,
    author: p.author?.name as string | undefined,
    authorUrl: p.author?.image as string | undefined,
  };

  return returnVal;
}

export default function CreatePost({ thread, posts }: Props) {
  let [postsContent, setPostContents] = useState<PostProps[]>(
    posts.map((p) => postToPostProps(p))
  );

  let [content, setContent] = useState("");
  const session = useSession();
  const { mutate, isError, isLoading } = useMutation({
    mutationFn: () => {
      setPostContents([
        ...postsContent,
        {
          content,
          author: session.data?.user.name as string | undefined,
          authorUrl: session.data?.user.image as string | undefined,
          createdAt: new Date(),
        },
      ]);
      return createPost({ threadId: thread.id, content });
    },

    onError: () => {
      setPostContents(postsContent.slice(0, -1));
    },
  });

  return (
    <Stack p={10}>
      <Text as={Link} href={`/${thread.category}`}>
        Go back
      </Text>
      <Text as={"h1"} fontSize={"7xl"}>
        {thread.title}
      </Text>
      {postsContent.map((p) => (
        <Post {...p} key={p.createdAt.toTimeString()}></Post>
      ))}
      <FormControl isInvalid={isError}>
        <Stack spacing={2}>
          <Textarea
            placeholder="This is the content of the post"
            onChange={(e) => setContent(e.target.value)}
          ></Textarea>
          <FormErrorMessage>Cannot be empty</FormErrorMessage>
          <Button
            w={60}
            bg={"darkturquoise"}
            disabled={isLoading}
            isLoading={isLoading}
            onClick={() => {
              session.data ? mutate() : redirect("/api/auth/signin");
            }}
          >
            Create post
          </Button>
        </Stack>
      </FormControl>
    </Stack>
  );
}
