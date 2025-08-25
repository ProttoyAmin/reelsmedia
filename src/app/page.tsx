"use client"
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';


export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (session) {
    return router.push('/dashboard')
  }
  console.log("User Session: ", session)
  return (
    <div className="home">
      <Link href="/login">Login</Link>
    </div>
  );
}