import Link from "next/link";

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const session = await auth();


  return (
    <HydrateClient>
     <div>
      Home Page
     </div>
    </HydrateClient>
  );
}
