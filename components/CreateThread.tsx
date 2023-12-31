"use client";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Button, Select } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Box,
} from "@chakra-ui/react";
import { Category } from "@prisma/client";
import { createThread } from "@/app/actions";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Props {
  category?: (typeof Category)[keyof typeof Category];
  open?: boolean;
}

export default function CreateThread({ category, open }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  let [selectedCategory, setSelectedCategory] = useState(category);
  let [title, setTitle] = useState("");
  let [content, setContent] = useState("");
  const router = useRouter();
  const session = useSession();

  const { data, mutate, isPending } = useMutation({
    mutationFn: () => {
      return createThread(selectedCategory as (typeof Category)[keyof typeof Category], title, content);
    },
    onSuccess(data, variables, context) {
      if (data) {
        router.push(`/${selectedCategory}/${data}`);
      }
    },
  });

  useEffect(() => {
    if (open) {
      onOpen();
    }
  }, []);

  return (
    <>
      <Button
        bg={"darkturquoise"}
        m={5}
        onClick={() =>
          session.data ? onOpen() : router.push("/api/auth/signin")
        }
      >
        Create Thread
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Thread</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                defaultValue={category}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value as (typeof Category)[keyof typeof Category]
                  )
                }
              >
                {Object.values(Category).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Title"
                name="title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Content</FormLabel>
              <Textarea
                placeholder="The first post in the thread"
                name="content"
                onChange={(e) => setContent(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {data === false && (
              <Box textColor={"red.300"} mr={3}>
                Invalid data
              </Box>
            )}
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => mutate()}
              isLoading={isPending}
              isDisabled={isPending}
            >
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
