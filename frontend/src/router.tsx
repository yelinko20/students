import { createBrowserRouter } from "react-router-dom";
import StudentLists from "@/components/students/StudentLists";
import MainLayout from "./MainLayout";
import CreateStudent from "@/components/students/CreateStudent";
import EditStudent from "@/components/students/EditStudent";
import StudentDetails from "@/components/students/StudentDetails";
import NotFound from "@/components/NotFound";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <StudentLists />,
        },
        {
          path: "/add-student",
          element: <CreateStudent />,
        },
        {
          path: "/edit/:id",
          element: <EditStudent />,
        },
        {
          path: "/details/:id",
          element: <StudentDetails />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
    {
      path: "/not-found",
      element: <NotFound />,
    },
  ]);
  return router;
};

export const router = Router();
