import { createBrowserRouter } from "react-router-dom";

import Layout from "@/components/Layout";
import Home from "@/routes/Home";
import MyProfile from "@/routes/MyProfile";
import Create from "@/routes/Create";
import Cause from "@/routes/Cause";
import Explore from "@/routes/Explore";
import MyCauses from "@/routes/MyCauses";

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
      },
      {
        path: '/mycauses',
        Component: MyCauses
      },
      {
        path: '/create',
        Component: Create
      },
      {
        path: '/cause/:id',
        Component: Cause
      },
      {
        path: '/explore',
        Component: Explore
      }
    ],
  },
]);

export default router;
