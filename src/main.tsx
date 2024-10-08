import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./components/AuthProvider/AuthProvider";
import { AppUserProvider } from "./components/AppUserProvider/AppUserProvider.tsx";
import { AdviceCollectionProvider } from "./components/AdviceCollectionProvider/AdviceCollectionProvider";
import { ToastNotificationProvider } from "./components/ToastNotificationProvider/ToastNotificationProvider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./routes/Root/Root";
import { Home } from "./routes/Home/Home";
import { Signup } from "./routes/Signup/Signup";
import { Login } from "./routes/Login/Login";
import { VerifyEmail } from "./routes/VerifyEmail/VerifyEmail";
import { ForgotPassword } from "./routes/ForgotPassword/ForgotPassword";
import "./i18n.ts";
import { LocaleProvider } from "./components/LocaleProvider/LocaleProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
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
      {
        path: "/forgotPassword",
        element: <ForgotPassword />,
      },
    ],
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <LocaleProvider>
      <ToastNotificationProvider seconds={6}>
        <AuthProvider>
          <AppUserProvider>
            <AdviceCollectionProvider>
              <RouterProvider router={router} />
            </AdviceCollectionProvider>
          </AppUserProvider>
        </AuthProvider>
      </ToastNotificationProvider>
    </LocaleProvider>
  </StrictMode>
);
