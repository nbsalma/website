import { notFound } from "next/navigation";

/** Any unknown deeper path renders the localized 404 page. */
export default function CatchAll() {
  notFound();
}
