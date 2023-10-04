import CreateThread from "@/components/CreateThread";
import { Center } from "@chakra-ui/react";
import React from "react";

export default function page() {
  return (
    <Center>
      <CreateThread category="COOKING" open={true}></CreateThread>
    </Center>
  );
}
