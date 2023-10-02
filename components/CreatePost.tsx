"use client";
import { createPost } from "@/app/actions";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface Props {
  threadId: number;
}

export default function CreatePost({ threadId }: Props) {
  let [content, setContent] = useState("");
  const router = useRouter();
  const { mutate, isError, isLoading } = useMutation({
    mutationFn: () => {
      return createPost({ threadId, content });
    },
    onSuccess: router.refresh,
  });

  return (
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
  );
}
