"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import { SessionProvider } from "next-auth/react";
import Pusher from "pusher-js";

import React, { useEffect } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
      throw Error("no pusher key");
    }

    const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "eu",
    });
    const channel = pusherInstance.subscribe("rickroll");

    channel.bind("rickroll-event", (data: string) => {
      console.log(data);
      router.push(data);
      //redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    });

    return () => {
      pusherInstance.unsubscribe("rickroll");
    };
  }, []);

  return (
    <SessionProvider session={session}>
      <CacheProvider>
        <ChakraProvider>{children}</ChakraProvider>
      </CacheProvider>
    </SessionProvider>
  );
}
