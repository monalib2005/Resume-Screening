import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";

// 👇 Get this from Clerk dashboard and set in .env
const VITE_CLERK_PUBLISHABLE_KEY = "pk_test_YXBwYXJlbnQtbGFtYi04LmNsZXJrLmFjY291bnRzLmRldiQ";
const publishableKey = VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={publishableKey}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);
