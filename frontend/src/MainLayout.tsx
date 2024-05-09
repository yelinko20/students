import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="container mx-auto my-8">
      <Outlet />
    </div>
  );
}
