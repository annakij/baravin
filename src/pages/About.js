import "./TextPages.css";

function About() {
    return (
        <div className="about-page">
            <h1>Om oss</h1>
            <p>Bara Vin är ett familjeägt företag som har sitt säte i Piemonte
                , norra Italien. Vi har en lång erfarenhet av att handla direkt med 
                vingårdar och kommer nu erbjuda alla som vill, att handla välgjorda viner 
                direkt hem till dörren.</p>
            <p>
            Hösten 2021 grundades Bara Vin, för att ge italienska småbönder en chans 
            att sälja sina viner till slutkonsumenter. Fler och fler upptäcker charmen 
            med att handla direkt från bonden och i liten skala.
            </p>

            <p>Vi hoppas att ni kommer gilla detta!</p>

            <p>Väl mött, <br/>Pernilla & Johan</p>


                <img 
            src={`${process.env.PUBLIC_URL}/images/IMG_8955_480x480.webp`} 
            alt="Vingård" 
            className="instructions-image"
          />

        </div>
    );
}

export default About;