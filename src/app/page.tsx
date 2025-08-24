"use client"
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";


export default function Home() {
  const { data: session, status } = useSession()
  console.log("User Session: ", session)
  return (
    <div className="home">
      
      {
        session ? (
            <Link href="/dashboard">Go To Feed</Link>
        ) : (
          <Link href="/login">Login</Link>
        )
      }
    </div>
  );
}