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
import { experimental_useOptimistic as useOptimistic } from "react";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Post, Thread } from "@prisma/client";

interface Props {
  thread: Thread;
  posts: Post[];
}

export default function CreatePost({ thread, posts }: Props) {
  let [postContents, setPostContents] = useState(posts.map((p) => p.content));

  let [content, setContent] = useState("");
  const router = useRouter();
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
            onClick={() => mutate()}
          >
            Create post
          </Button>
        </Stack>
      </FormControl>
    </Stack>
  );
}
