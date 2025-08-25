"use client"
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";


export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  
  }, [session, router])
  
  
  console.log("User Session: ", session)
  return (
    <>
    <div className="home">
      <Link href="/login">Login</Link>
    </div>
    </>
  );
}