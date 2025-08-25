import { useNavigate } from "react-router-dom";
import BaraVinHeader from "../images/BARA_VIN_logo_transparent.png"
import Logo from "../images/baravinlogo.avif"
import "./startPage.css";


function StartPage () {

    const navigate = useNavigate();

    return (
        <div className="container">
            <img src= {BaraVinHeader} alt="Bara Vin Header" id="baravinheader"/>
            <p>Dessa sidor innehåller information om vin och vänder sig därför endast till dig som är över 20 år. Handla ansvarsfullt!</p>
            
            <button className="custom-button" onClick={() => navigate("/privat")}>
                Privat
            </button>
        
            <button className="custom-button" onClick={() => navigate("/restaurang")}>
                Restaurang
            </button>

            <img src={Logo} alt="Bara Vin Logo" id="baravinlogo"/>
        </div>
    )
}

export default StartPage;
