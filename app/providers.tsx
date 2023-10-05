"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import { SessionProvider, useSession } from "next-auth/react";
import Pusher from "pusher-js";
import { isAdmin } from "./actions";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//const AdminContext = createContext(false);
const PusherContext = createContext<Pusher | undefined>(undefined);

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const router = useRouter();
  const [pusher, setPusher] = useState<Pusher>();
  const [playing, toggle, setAudio] = useAudio("/fun.mp3");
  const queryClient = new QueryClient();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
      throw Error("no pusher key");
    }

    const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "eu",
    });
    setPusher(pusherInstance);
    const rickroll = pusherInstance.subscribe("rickroll");
    const audio = pusherInstance.subscribe("audio");

    rickroll.bind("rickroll-event", (data: string) => {
      console.log(data);
      router.push(data);
      //redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    });

    audio.bind("audio-set", (data: string) => {
      setAudio(new Audio(data));
    });

    audio.bind("audio-play", (data: string) => {
      toggle();
    });

    console.log(playing);
    return () => {
      pusherInstance.unsubscribe("rickroll");
      pusherInstance.unsubscribe("audio");
    };
  }, []);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <PusherContext.Provider value={pusher}>
          <CacheProvider>
            <ChakraProvider>{children}</ChakraProvider>
          </CacheProvider>
        </PusherContext.Provider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

// function AdminProvider({ children }: { children: React.ReactNode }) {
//   const { data } = useSession();
//   let [admin, setAdmin] = useState(false);

//   useEffect(() => {
//     const fetchAdminStatus = async () => {
//       const resp = await isAdmin();
//       setAdmin(resp);
//     };
//     if (data) {
//       fetchAdminStatus();
//     }
//   }, [data]);

//   return (
//     <AdminContext.Provider value={admin}>{children}</AdminContext.Provider>
//   );
// }

// export function useIsAdmin() {
//   return useContext(AdminContext);
// }

export function usePusher() {
  return useContext(PusherContext);
}

export function useAudio(
  url: string
): [
  boolean,
  () => void,
  React.Dispatch<React.SetStateAction<HTMLAudioElement>>
] {
  const [audio, setAudio] = useState<HTMLAudioElement>(new Audio());
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    console.log("audio");
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, [audio]);

  return [playing, toggle, setAudio];
}
