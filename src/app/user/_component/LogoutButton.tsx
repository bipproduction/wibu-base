"use client";
import { apies, pages } from "@/lib/routes";
import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";

export function LogoutButton({ token }: { token: string }) {
  const router = useRouter();
  async function logout() {
    const res = await fetch(apies["/api/logout"], {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      return router.push(pages["/login"]);
    }

    return alert(await res.text());
  }
  return (
    <Button onClick={logout} variant="transparent" size="sm">
      Logout
    </Button>
  );
}
