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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormLabel,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";

import { redirect, useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import { Thread } from "@prisma/client";
import { useSession } from "next-auth/react";
//import Link from "next/link";
import { Link } from "@chakra-ui/next-js";
import { getPostsAndUser } from "@/app/actions";
import Post, { ParentData, PostProps } from "./Post";

type ItemType<T extends any[]> = T extends (infer R)[] ? R : any;

function postToPostProps(
  p: ItemType<Awaited<ReturnType<typeof getPostsAndUser>>>,
  onReply: (p: PostProps) => void
): PostProps {
  const returnVal: PostProps = {
    id: p.id,
    content: p.content,
    createdAt: p.createdAt,
    author: p.author?.name as string | undefined,
    authorUrl: p.author?.image as string | undefined,
    replyTo: p.replyTo ? p.replyTo.content : undefined,
    onReply: onReply,
  };

  return returnVal;
}

interface Props {
  thread: Thread;
  posts: Awaited<ReturnType<typeof getPostsAndUser>>;
}

export default function CreatePost({ thread, posts }: Props) {
  let [content, setContent] = useState("");
  let [replyPost, setReplyPost] = useState<PostProps | undefined>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  const onClose2 = () => {
    onClose(), setReplyPost(undefined);
    setContent("");
  };

  let [postsContent, setPostContents] = useState<PostProps[]>(
    posts.map((p) =>
      postToPostProps(p, (pp: PostProps) => {
        setReplyPost(pp), onOpen();
      })
    )
  );

  const session = useSession();
  const { mutate, isError, isPending, reset } = useMutation({
    mutationFn: () => {
      setPostContents([
        ...postsContent,
        {
          id: 69420,
          content,
          author: session.data?.user.name as string | undefined,
          authorUrl: session.data?.user.image as string | undefined,
          createdAt: new Date(),
          replyTo: replyPost?.content,
          onReply: (pp: PostProps) => {
            setReplyPost(pp), onOpen();
          },
        },
      ]);
      return createPost({
        threadId: thread.id,
        content,
        replyId: replyPost?.id,
      });
    },

    onSuccess: () => {
      setContent("");
      onClose2();
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
        <Post {...p} key={p.createdAt + p.content}></Post>
      ))}
      <FormControl isInvalid={isError}>
        <Stack spacing={2}>
          <Textarea
            placeholder="This is the content of the post"
            onChange={(e) => {
              setContent(e.target.value);
              reset();
            }}
          ></Textarea>
          <FormErrorMessage>Cannot be empty</FormErrorMessage>
          <Button
            w={60}
            bg={"darkturquoise"}
            disabled={isPending}
            isLoading={isPending}
            onClick={() => {
              session.data ? mutate() : redirect("/api/auth/signin");
            }}
          >
            Create post
          </Button>
        </Stack>
      </FormControl>
      <Modal isOpen={isOpen} onClose={onClose2} initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`Create reply to ${
            replyPost?.author ? replyPost?.author : "[REDACTED]"
          }`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormLabel>{`${
              replyPost?.author ? replyPost?.author : "[REDACTED]"
            }'s post`}</FormLabel>
            <Textarea disabled={true}>{replyPost?.content}</Textarea>

            <FormControl>
              <FormLabel>Your post</FormLabel>
              <Textarea
                ref={initialRef}
                onChange={(e) => setContent(e.target.value)}
              ></Textarea>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => mutate()}
              isLoading={isPending}
              isDisabled={isPending}
            >
              Create
            </Button>
            <Button variant="ghost" onClick={onClose2}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  );
}
