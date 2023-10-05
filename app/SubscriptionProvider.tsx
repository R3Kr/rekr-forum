"use client";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePusher } from "./providers";
import { Channel } from "pusher-js";
import { Thread } from "@prisma/client";
import { Box, useToast } from "@chakra-ui/react";
import Link from "next/link";

const SubscriptionContext = createContext<Channel | undefined>(undefined);
const SubscriptionsContext = createContext<
  [number[], (nums: number[]) => void]
>([[], (nums) => {}]);
const NewpostContext = createContext<(t: Thread) => void>(() => {});

export default function SubscriptionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pusher = usePusher();
  let [subscription, setSubscription] = useState<Channel>();
  let [subscriptions, setSubscriptions] = useState<number[]>([]);
  const toast = useToast();

  function newPost(t: Thread) {
    toast({
      position: "bottom-left",
      render: () => (
        <Box color="white" p={3} bg="blue.500">
          <Link href={`/${t.category}/${t.title}`}>
            {`The subscribed thread ${t.title} just had a new post!`}
          </Link>
        </Box>
      ),
    });
  }

  useEffect(() => {
    setSubscription(pusher?.subscribe("threads"));

    return () => {
      pusher?.unsubscribe("threads");
    };
  }, [pusher, subscription]);

  useEffect(() => {
    if (pusher) {
      try {
        const data = window.localStorage.getItem("subscriptions");
        if (data) {
          setSubscriptions(JSON.parse(data));

          JSON.parse(data).map((s: any) => {
            subscription?.bind(s.toString(), (t: Thread) => newPost(t));
            if (!subscription) {
              console.log("not subscribed");
            }
            console.log("test");
          });
        }
      } catch (e) {
        // if error, return initial value
        console.log(e);
      }
    }
  }, [subscription]);

  return (
    <SubscriptionContext.Provider value={subscription}>
      <SubscriptionsContext.Provider value={[subscriptions, setSubscriptions]}>
        <NewpostContext.Provider value={newPost}>
          {children}
        </NewpostContext.Provider>
      </SubscriptionsContext.Provider>
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const sub = useContext(SubscriptionContext);
  const [subs, setSubs] = useContext(SubscriptionsContext);
  const newPost = useContext(NewpostContext);

  const addSub = (num: number) => {
    sub?.bind(num.toString(), (t: Thread) => newPost(t));
    setSubs([...subs, num]);
    window.localStorage.setItem(
      "subscriptions",
      JSON.stringify([...subs, num])
    );
    console.log(`Subscribed to ${num}`);
  };

  const removeSub = (num: number) => {
    sub?.unbind(num.toString(), (t: Thread) => newPost(t));
    setSubs(subs.filter((s) => s !== num));
    window.localStorage.setItem(
      "subscriptions",
      JSON.stringify(subs.filter((s) => s !== num))
    );
    console.log(`Unsubscribed to ${num}`);
  };

  const isSubbed = (num: number) => {
    return subs.includes(num);
  };

  return { addSub, removeSub, isSubbed };
}
