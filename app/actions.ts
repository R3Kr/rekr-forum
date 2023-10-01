"use server";

import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

export async function isAdmin() {
  const session = await getServerSession();
  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string | undefined,
    },
  });

  return user?.role === "ADMIN";
}
