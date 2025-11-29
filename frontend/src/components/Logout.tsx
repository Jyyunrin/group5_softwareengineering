/**
 * Logout button that calls backend and redirects to login
 */
export default function Logout() {
  // handle logout click
  const attemptLogout = async (e: React.FormEvent) => {
    // prevent default form submit reload
    e.preventDefault();

    try {
      const response = await fetch(
        import.meta.env.VITE_SERVER_URL + "/logout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Logout failed with status:", response.status);
        return;
      }

      // optional: parse response if backend returns JSON
      try {
        const data = await response.json();
        console.log("Logout response:", data);
      } catch {
        // ignore JSON parse errors if no body
      }

      console.log("Successful logout attempt");
      // redirect to login after logout
      window.location.replace(import.meta.env.VITE_REDIRECT_URL + "login");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <form className="login_form" onSubmit={attemptLogout}>
      <button className="upload_button" type="submit" name="upload">
        Logout
      </button>
    </form>
  );
}
