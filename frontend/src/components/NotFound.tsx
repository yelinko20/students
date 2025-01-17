import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <img
          src="https://cdn.rawgit.com/ahmedhosna95/upload/1731955f/sad404.svg"
          alt="404"
          className="w-20 mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold mb-2">404 PAGE</h1>
        <p className="text-gray-600 mb-4">
          The page you were looking for could not be found
        </p>
        <Button onClick={() => navigate("/")}>Back to home</Button>
      </div>
    </div>
  );
}
