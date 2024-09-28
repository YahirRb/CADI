import { createBrowserRouter } from "react-router-dom";
import Index from "@/routes/(index)/Index";
import Login from "@/routes/login/Login";
import Layout from "./routes/(index)/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ path: "", element: <Index /> }],
  },
  { path: "/login", element: <Login /> },
]);

export default router;
