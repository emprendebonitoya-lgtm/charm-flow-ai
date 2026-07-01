import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useUser } from "@/lib/user";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "MAGNETO" }],
  }),
  component: IndexRedirect,
});

function IndexRedirect() {
  const { authLoading, authUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;

    navigate({
      to: authUser ? "/dashboard" : "/landing",
      replace: true,
    });
  }, [authLoading, authUser, navigate]);

  return null;
}
