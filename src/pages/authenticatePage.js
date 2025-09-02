
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/footer.js";
import Navbar from "../components/navbar.js";
import SignInForm from "../components/signInForm.js";
import RegisterForm from "../components/registerForm.js";

function AuthenticatePage ()
{
    const location = useLocation();
    const path = location.pathname;

    let content;
    if (path == "/authenticate/register")
    {
        content = <RegisterForm/>;
    } else
    {
        content = <SignInForm/>
    }


    return (
        <>
        <Navbar/>
        {content}
        <Footer/>
        </>
    )

}

export default AuthenticatePage