"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { Category } from "@prisma/client";
import { fork } from "child_process";
import { redirect } from "next/navigation";
import { FaSadCry } from "react-icons/fa";

export async function isAdmin() {
  const session = await getServerSession();
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
  const session = await getServerSession();
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

    console.log(data);
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email as string | undefined,
      },
    });

    const thread = await prisma.thread.create({
      data: {
        category: data.category as (typeof Category)[keyof typeof Category],
        title: data.title,
        userId: user?.id,
      },
    });

    const post = await prisma.post.create({
      data: {
        content: data.content,
        userId: user?.id,
        threadId: thread.id,
      },
    });

    if (thread && post) {
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
});

export async function createPost(userData: {
  threadId: number;
  content: string;
}) {
  const session = await getServerSession();
  if (!session) {
    console.log("unauthorized");
    throw Error("unathorized");
  }

  try {
    const data = postFormData.parse(userData);

    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email as string | undefined,
      },
    });

    const post = await prisma.post.create({
      data: {
        content: data.content,
        userId: user?.id,
        threadId: data.threadId,
      },
    });

    return post;
  } catch (error) {
    console.log(error);
    throw Error("something failed");
  }
}
