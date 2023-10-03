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
import { Post, Thread } from "@prisma/client";
import { useSession } from "next-auth/react";
//import Link from "next/link";
import { Link } from "@chakra-ui/next-js";
interface Props {
  thread: Thread;
  posts: Post[];
}

export default function CreatePost({ thread, posts }: Props) {
  let [postContents, setPostContents] = useState(posts.map((p) => p.content));

  let [content, setContent] = useState("");
  const router = useRouter();
  const session = useSession();
  const { mutate, isError, isLoading } = useMutation({
    mutationFn: () => {
      setPostContents([...postContents, content]);
      return createPost({ threadId: thread.id, content });
    },

    onError: () => {
      setPostContents(postContents.filter((p) => p !== content));
    },
  });

  return (
    <Stack p={10}>
      <Text as={Link} href={`/${thread.category}`}>Go back</Text>
      <Text as={"h1"} fontSize={"7xl"}>
        {thread.title}
      </Text>
      {postContents.map((p) => (
        <Box key={p}>{p}</Box>
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
