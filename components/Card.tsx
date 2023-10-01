import { useIsAdmin } from "@/app/providers";
import { CloseIcon } from "@chakra-ui/icons";
import { Box, Spacer, Flex } from "@chakra-ui/react";

import React from "react";

export default function Card({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  const admin = useIsAdmin();

  return (
    <Flex bg="tomato" height="80px">
      {children}
      <Spacer />
      {admin && <CloseIcon onClick={onClick} />}
    </Flex>
  );
}
