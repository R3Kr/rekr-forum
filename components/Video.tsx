"use client";
import React, { useEffect } from "react";
import { Button, Center } from "@chakra-ui/react";
import { GeyContext } from "@/app/providers";
import { useContext, useState } from "react";

export default function Video() {
  const signal = useContext(GeyContext);
//   const [play, setPlay] = useState(false);

//   useEffect(() => {
//     setPlay(signal);
//   }, [signal]);

  return (
    <>
      <Center>
        {signal && <video autoPlay loop src={signal}></video>}
      </Center>
    </>
  );
}
