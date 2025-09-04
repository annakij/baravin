import { useNavigate } from "react-router-dom";
import BaraVinHeader from "../images/BARA_VIN_logo_transparent.png"
import Logo from "../images/baravinlogo.avif"
import "./StartPage.css";


function StartPage () {

    const navigate = useNavigate();

    return (
        <div className="start-site">
            <img className="start-header" src= {BaraVinHeader} alt="Bara Vin Header"/>
            <p className="start-text">Dessa sidor innehåller information om vin och vänder sig därför endast till dig som är över 20 år. Handla ansvarsfullt!</p>
            
            <button className="custom-button" onClick={() => navigate("/privat")}>
                Privat
            </button>
        
            <button className="custom-button" onClick={() => navigate("/restaurang")}>
                Restaurang
            </button>

            <img className="start-logo" src={Logo} alt="Bara Vin Logo"/>
        </div>
    )
}

export default StartPage;
