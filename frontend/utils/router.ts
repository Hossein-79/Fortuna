import { createBrowserRouter } from "react-router-dom";

import Layout from "@/components/Layout";
import Home from "@/routes/Home";
import MyProfile from "@/routes/MyProfile";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: '/myprofile',
        Component: MyProfile,
      }
    ],
  },
]);

export default router;
