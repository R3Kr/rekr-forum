import { useIsAdmin } from "@/app/providers";
import { CloseIcon } from "@chakra-ui/icons";
import { Box, Spacer, Flex } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
} from "@chakra-ui/react";

import React, { useRef } from "react";

export default function Card({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  const admin = useIsAdmin();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<any>();

  return (
    <>
      <Flex bg="tomato" height="80px">
        {children}
        <Spacer />
        {admin && <CloseIcon onClick={onOpen} />}
      </Flex>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Post
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onClick} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
