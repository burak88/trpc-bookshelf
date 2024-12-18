import HomeCard from "@/components/comp/homeCard";
import { api, HydrateClient } from "@/trpc/server";
import Link from "next/link";

export default async function Home() {
  
  return (
    // <HydrateClient>
    <>
      <Link href={"/bookshelf"} className="rounded-lg bg-slate-300 p-3">
        Add Book Shelf
      </Link>
      <div className="grid grid-cols-5 gap-8 p-4">
            <HomeCard />
      </div>
    </>

    // </HydrateClient>
  );
}
