"use client"
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";


export default function Home() {
  const { data: session, status } = useSession()
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