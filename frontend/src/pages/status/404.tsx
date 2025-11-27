/**
 * This is a basic 404 page.
 */
import { useNavigate } from "react-router-dom";

export default function CannotFindPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen mx-auto w-full max-w-[1080px] grid place-items-center bg-white">
      <div className="text-center">
        <img
          src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBAQEBAQDw8PDw8PDw8QDw8NDw8PFREWFhURFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OFxAQFy0dHR0tLS0tLS0tLS0tKystLS0tKy0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH..."
          alt=""
          className="w-64 mx-auto"
        />

        <h1 className="text-5xl font-extrabold tracking-tight mt-4">404</h1>
        <p className="mt-2 text-sm text-gray-400">
          This page is not for you, kiddo...
        </p>

        <div className="flex justify-center gap-4 mt-6">
          {/* Go Back */}
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
          >
            ← Go Back
          </button>

          {/* Go to Home */}
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            Go to Main Page →
          </button>
        </div>
      </div>
    </div>
  );
}
