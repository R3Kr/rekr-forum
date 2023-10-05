import React, { useRef } from "react";
import {
  Button,
  Flex,
  Text,
  Stack,
  Spacer,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormLabel,
  Textarea,
  FormControl,
  ModalFooter,
} from "@chakra-ui/react";
import { getPostsAndUser } from "@/app/actions";
import Image from "next/image";

// type ItemType<T extends any[]> = T extends (infer R)[] ? R : any;

// interface Props {
//   post: ItemType<Awaited<ReturnType<typeof getPostsAndUser>>>;
// }

export interface ParentData {
  setContent: React.Dispatch<React.SetStateAction<string>>;
  mutate: () => void;
  isError: boolean;
  isLoading: boolean;
  reset: () => void;
}

export interface PostProps {
  id: number;
  content: string;
  author?: string;
  authorUrl?: string;
  createdAt: Date;
  replyTo?: string;
  onReply: (p: PostProps) => void;
}

export default function Post(post: PostProps) {
  return (
    <Stack>
      {post.replyTo && (
        <Text
          textColor={"red.300"}
        >{`A reply to: ${post.replyTo}`}</Text>
      )}
      <Text>{`${post.content}`}</Text>

      <HStack maxW={"16"}>
        <Image
          src={post.authorUrl ? post.authorUrl : "/bruh.jpg"}
          alt="profile pic"
          width={20}
          height={20}
        ></Image>
        <Spacer />
        <Button
          h={5}
          w={5}
          bg={"blue.300"}
          fontSize={10}
          onClick={() => post.onReply(post)}
        >
          Reply
        </Button>
      </HStack>

      <Text>{`made by: ${
        post.author ? post.author : "[REDACTED]"
      } |  ${post.createdAt.toString()}`}</Text>
      <Text>--------------------------------------</Text>
      <br></br>
    </Stack>
  );
}
