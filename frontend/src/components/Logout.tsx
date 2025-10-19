
export default function Logout() {
    const attemptLogout = async () => {

        // TODO: CHANGE THIS URL
        const data = await fetch(import.meta.env.VITE_SERVER_URL + "/logout", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                // TODO: temp cookie fix
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                // ---
             },
            credentials: 'include'
        });

        const upload_response = await data.json();
        if (upload_response) {
            console.log("Successful logout attempt");

            // TODO: temp cookie fix
            localStorage.removeItem("jwt");
            document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=Lax";
            // ---
            window.location.replace(import.meta.env.VITE_REDIRECT_URL + "/login")
        } else {
            console.log("Error Found");
        }
    }

    return (
        <>
        <form className="login_form" onSubmit={attemptLogout}>
            <button className="upload_button" type="submit" name="upload">
                Logout
            </button>
        </form>
        </>
    )
}