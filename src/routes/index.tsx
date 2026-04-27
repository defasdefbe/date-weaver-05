import { createFileRoute } from "@tanstack/react-router";
import { BookingApp } from "@/components/booking/BookingApp";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Tempo · Book a quiet hour" },
      {
        name: "description",
        content:
          "A calmer way to schedule. Pick a time with Maya and bring whatever's on your mind.",
      },
      { property: "og:title", content: "Tempo · Book a quiet hour" },
      {
        property: "og:description",
        content: "A calmer way to schedule meetings.",
      },
    ],
  }),
});

function Index() {
  return <BookingApp />;
}
