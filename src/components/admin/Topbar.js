import "./AdminLayout.css";
import  { ArrowLeftFromLine } from "lucide-react";
import "./AdminLayout.css";

function Topbar () {

    return (

        <>
        <div className="admin-topbar">
            <a className="back-to-site" href="/">
            <ArrowLeftFromLine />
            <p>Tillbaka till Hemsidan</p>
            </a>

            <div className="greeting-topbar">
                <p>Välkommen tillbaka!</p>
            </div>
        </div>
        </>

    );
}

export default Topbar;