"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import { SessionProvider, useSession } from "next-auth/react";
import Pusher from "pusher-js";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SubscriptionProvider from "./SubscriptionProvider";

//const AdminContext = createContext(false);
const PusherContext = createContext<Pusher | undefined>(undefined);
export const GeyContext = createContext<false | string>(false);

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
  const [gey, setGey] = useState<false | string>(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
      throw Error("no pusher key");
    }

    const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "eu",
    });
    setPusher(pusherInstance);
    const rickroll = pusherInstance.subscribe("rickroll");
    const media = pusherInstance.subscribe("media");

    rickroll.bind("rickroll-event", (data: string) => {
      //console.log(data);
      router.push(data);
      //redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    });

    media.bind("audio-set", (data: string) => {
      setAudio(new Audio(data));
      //console.log("aduioset")
    });

    media.bind("audio-play", (data: string) => {
      toggle();
      //console.log("audioplay")
    });

    media.bind("video", (data: string) => {
      setGey(data);
      
    });
    media.bind("gey", (data: string) => {
      setGey("/gey.webm");
      setTimeout(() => {
        setGey(false)
      }, 14000)
    });

    media.bind("pork", (data: string) => {
      setGey("/pork.webm");
    });

    console.log(playing);
    return () => {
      media.unbind_all()
      rickroll.unbind_all()
      pusherInstance.unsubscribe("rickroll");
      pusherInstance.unsubscribe("audio");
    };
  }, []);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <PusherContext.Provider value={pusher}>
          <SubscriptionProvider>
            <GeyContext.Provider value={gey}>
              <CacheProvider>
                <ChakraProvider>{children}</ChakraProvider>
              </CacheProvider>
            </GeyContext.Provider>
          </SubscriptionProvider>
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
