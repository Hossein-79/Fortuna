import { createBrowserRouter } from "react-router-dom";

import Layout from "@/components/Layout";
import Home from "@/routes/home";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
]);

export default router;
