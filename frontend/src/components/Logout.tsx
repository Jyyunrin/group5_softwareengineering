/**
 * Logout logic with robust error handling
 */
import React from "react";

export default function Logout({ email }: { email: string }) {
  const attemptLogout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!email) throw new Error("No email provided for logout.");

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server responded with an error:", text);
        alert(`Logout failed: ${response.status} ${response.statusText}`);
        return;
      }

      let uploadResponse;
      try {
        uploadResponse = await response.json();
      } catch {
        throw new Error("Invalid JSON response from server.");
      }

      if (uploadResponse?.success) {
        console.log("Successful logout attempt");
        alert("You have been logged out successfully.");
      } else {
        console.error("Logout failed:", uploadResponse);
        alert(uploadResponse?.message || "Logout failed. Please try again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert((err as Error).message || "An unexpected error occurred.");
    }
  };

  return (
    <form className="login_form" onSubmit={attemptLogout}>
      <button className="upload_button" type="submit">
        Logout
      </button>
    </form>
  );
}
