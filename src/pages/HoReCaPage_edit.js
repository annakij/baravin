import { useNavigate } from "react-router-dom";
import WineyardHeader from "../images/punset_0547.jpg"
import Logo from "../images/baravinlogo.avif"
import "./HoReCaPage.css"
import Footer from "../components/Footer_edit.js"

function RestaurantPage () {
    
    const navigate = useNavigate();

    return (
        <div className="custom-container">
            <img className="wineyardHeader" src={WineyardHeader} alt="Punset Wineyard Header"/>
            <img className="baravinLogo" src={`${process.env.PUBLIC_URL}/Bara-Vin_Neg.png`} alt="Bara Vin Logo"/>
            <div className="header-text">
            <h1>Härliga guldkorn från Europa</h1>
            <h2>– Små gårdar som arbetar med respekt för naturen!</h2>
            </div>

            <div className="info-section">
                <div>
                <h1>Frakt!</h1>
                <h3>Fraktfritt inom Göteborg vid köp av 6 lådor.</h3>
                <h3>Fraktfritt inom Sverige vid köp av 10 lådor.</h3>
                <h3>Annars tar vi ut en fraktavgift på 300kr.</h3>
                </div>
                <a className="custom-button">Prislista</a>
                <a className="custom-button" href="/">← Startsida</a>
                <h3>+46 (0) 708965567</h3>
            </div>

            <Footer/>

        </div>
    )
}

export default RestaurantPage;