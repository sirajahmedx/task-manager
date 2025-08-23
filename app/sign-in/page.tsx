"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-gray-900 text-white flex items-center justify-center">
      <Button
        variant="outline"
        size="lg"
        className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-md hover:bg-slate-500 transition-all text-xl"
        onClick={() => signIn("google")}
      >
        Login with Google
      </Button>
    </div>
  );
}
