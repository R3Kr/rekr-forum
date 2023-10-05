"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { Category } from "@prisma/client";
import { fork } from "child_process";
import { redirect } from "next/navigation";
import { FaSadCry } from "react-icons/fa";
import { revalidatePath, revalidateTag } from "next/cache";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_ID as string,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: "eu",
  useTLS: true,
});

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string | undefined,
    },
  });

  return user?.role === "ADMIN";
}

const threadFormData = z.object({
  category: z.union(
    Object.values(Category).map((val) => z.literal(val)) as any
  ),
  title: z.string().min(1),
  content: z.string().min(1),
});

export async function createThread(
  category: (typeof Category)[keyof typeof Category],
  title: string,
  content: string
): Promise<number | false> {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.log("unauthorized");
    return false;
  }

  try {
    const data = threadFormData.parse({
      category: category,
      title: title,
      content: content,
    });

    const thread = await prisma.thread.create({
      data: {
        category: data.category as (typeof Category)[keyof typeof Category],
        title: data.title,
        userId: session.user.id,
      },
    });

    const post = await prisma.post.create({
      data: {
        content: data.content,
        userId: session.user.id,
        threadId: thread.id,
      },
    });

    if (thread && post) {
      revalidateTag(thread.category);
      return thread.id;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

const postFormData = z.object({
  threadId: z.number(),
  content: z.string().min(1),
  replyId: z.number().optional(),
});

export async function createPost(userData: {
  threadId: number;
  content: string;
  replyId?: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.log("unauthorized");
    throw Error("unathorized");
  }

  try {
    const data = postFormData.parse(userData);

    const post = await prisma.post.create({
      data: {
        content: data.content,
        userId: session.user.id,
        threadId: data.threadId,
        replyId: data.replyId,
      },
      include: {
        thread: true,
      },
    });

    revalidateTag(data.threadId.toString());
    pusher.trigger("threads", data.threadId.toString(), post.thread)
    return post;
  } catch (error) {
    console.log(error);
    throw Error("something failed");
  }
}

export async function getThreadsAndUser(
  category: (typeof Category)[keyof typeof Category]
) {
  return prisma.thread.findMany({
    where: {
      category: category,
    },
    include: {
      author: {
        select: {
          image: true,
          name: true,
        },
      },
    },
  });
}

export async function getPostsAndUser(threadId: number) {
  return prisma.post.findMany({
    where: {
      threadId: threadId,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      replyTo: true,
    },
  });
}
