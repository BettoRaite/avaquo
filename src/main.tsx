import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./components/AuthProvider";
import { AdviceCollectionProvider } from "./components/AdviceCollectionProvider/AdviceCollectionProvider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./routes/Home/Home";
import { Signup } from "./routes/Signup/Signup";
import { VerifyEmail } from "./routes/VerifyEmail/VerifyEmail";
import { Login } from "./routes/Login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/verify",
    element: <VerifyEmail />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AuthProvider>
      <AdviceCollectionProvider>
        <RouterProvider router={router} />
      </AdviceCollectionProvider>
    </AuthProvider>
  </StrictMode>
);
