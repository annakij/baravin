import { useNavigate } from "react-router-dom";
import WineyardHeader from "../images/punset_0547.jpg"
import Logo from "../images/baravinlogo.avif"
import "./hoReCaPage.css"
import Footer from "../components/footer.js"

function RestaurantPage () {
    
    const navigate = useNavigate();

    return (
        <div className="custom-container">
            <img src={WineyardHeader} alt="Punset Wineyard Header" id="wineyardHeader"/>
            <img src={Logo} alt="Bara Vin Logo" id="baravinLogo"/>
            <h1>Härliga guldkorn från Europa</h1>
            <h2>– Små gårdar som arbetar med respekt för naturen!</h2>

            <button>Prislista</button>

            <Footer/>

        </div>
    )
}

export default RestaurantPage;