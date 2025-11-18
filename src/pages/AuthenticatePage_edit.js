
import { useLocation } from "react-router-dom";
import SignInForm from "../components/AuthSignInForm.js";
import RegisterForm from "../components/AuthRegisterForm.js";

function AuthenticatePage ()
{
    const location = useLocation();
    const path = location.pathname;

    let content;
    if (path == "/authenticate/registrera")
    {
        content = <RegisterForm/>;
    } else
    {
        content = <SignInForm/>
    }


    return (
        <>
        {content}
        </>
    )

}

export default AuthenticatePage