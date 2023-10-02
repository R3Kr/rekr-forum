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

const AdminContext = createContext(false);

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const router = useRouter();
  const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <AdminProvider>
          <CacheProvider>
            <ChakraProvider>{children}</ChakraProvider>
          </CacheProvider>
        </AdminProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

function AdminProvider({ children }: { children: React.ReactNode }) {
  const { data } = useSession();
  let [admin, setAdmin] = useState(false);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      const resp = await isAdmin();
      setAdmin(resp);
    };
    if (data) {
      fetchAdminStatus();
    }
  }, [data]);

  return (
    <AdminContext.Provider value={admin}>{children}</AdminContext.Provider>
  );
}

export function useIsAdmin() {
  return useContext(AdminContext);
}
