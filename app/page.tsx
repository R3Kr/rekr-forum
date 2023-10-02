import Admin from "@/components/Admin";
import Forum from "@/components/Forum";
import { Category } from "@prisma/client";
import Link from "next/link";

const posts = ["awd", "wqweqwe", "123", "adwdawd", "123qwe"];
const categories = Object.keys(Category).filter((v) => isNaN(Number(v)));

export default async function Home() {
  

  return (
    <>
      <Admin />
      <Forum pposts={posts}></Forum>
      {categories.map((c) => (
        <>
          <Link key={c} href={`/${c.toLowerCase()}`}>
            {c}
          </Link>
          <br></br>
        </>
      ))}
    </>
  );
}
