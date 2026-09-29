import React from "react";
import { matchRoute } from "./lib/routes.js";
import HomePage from "./pages/HomePage.jsx";
import InvitationPage from "./pages/InvitationPage.jsx";
import RsvpPage from "./pages/RsvpPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  const route = matchRoute(window.location.pathname);

  if (route.page === "home") return <HomePage />;
  if (route.page === "invitation") return <InvitationPage side={route.side} slug={route.slug} />;
  if (route.page === "rsvp") return <RsvpPage side={route.side} />;
  return <NotFoundPage />;
}
