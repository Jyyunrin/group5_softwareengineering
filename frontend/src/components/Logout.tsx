
export default function Logout({email}: {email: string}) {
    const attemptLogout = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        let formData = {
            "email": email
        }
        const jsonData = JSON.stringify(formData)

        // TODO: CHANGE THIS URL
        const data = await fetch(import.meta.env.VITE_SERVER_URL + "/logout", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: jsonData,
        });

        const upload_response = await data.json();
        if (upload_response) {
            console.log("Successful logout attempt");
            // window.location.replace()
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