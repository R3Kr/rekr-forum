"use client";

import { useIsAdmin } from "@/app/providers";
import React from "react";

export default function Admin() {
  const admin = useIsAdmin();
  return <div>{admin ? "Admin" : "User"}</div>;
}
