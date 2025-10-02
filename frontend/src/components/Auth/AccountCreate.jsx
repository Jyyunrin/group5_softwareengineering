import bcrypt from 'bcryptjs'

export default function Login() {
    const attemptRegister = async (event) => {
        event.preventDefault()

        const salt = bcrypt.genSaltSync(10)
        
        const hashedPassword = bcrypt.hashSync(event.target.password.value, '$2a$10$CwTycUXWue0Thq9StjUM0u') 
        // hash created previously created upon sign up

        let formData = {
            "email": event.target.email.value,
            "password": hashedPassword,
        }
        const jsonData = JSON.stringify(formData)
        console.log(jsonData)

        // TODO: CHANGE THIS URL
        const data = await fetch(import.meta.env.VITE_SERVER_URL + "/register", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: jsonData,
        });

        const upload_response = await data.json();
        if (upload_response) {
            console.log("Successful register attempt");
            // window.location.replace()
        } else {
            console.log("Error Found");
        }
    }

    return (
        <>
        <div id="account_form_title">Create Account</div>
        <form className="login_form" onSubmit={attemptRegister}>
            <input id="email_field" type="text" name="email"/>
            <br/>
            <input id="password_field" type="password" name="password"/>
            <br/>
            <button className="upload_button" type="submit" name="upload">Register</button>
        </form>
        </>
    )
}