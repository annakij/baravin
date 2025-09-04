import "./TextPages.css";

function InstructionsPage() {
    return (
      <div className="instructions-page">
        <h1>Såhär fungerar det</h1>

        <p>Bara Vin är en Italiensk vinagent som hjälper små vingårdar att hitta vinälskare.</p>

        <p>Vinet skickas direkt från vingården till kunden, därav lite högre fraktkostnader 
          {"("}inräknat i priset{")"} samt leveranstid. Vill man beställa mer eller annorlunda, kontakta oss på 
          {" "}<a className="link" href="mailto:info@baravin.nu">info@baravin.nu</a> så tittar vi på en lösning.</p>

          <p>Det tar ca 10 arbetsdagar från det att lådan beställs och betalas, till att den når dig som slutkonsument.
             Eller ca 5-7 dagar från bekräftad beställning. Hur man nu vill se på saken{" :)"}</p>
          <p>Vi har med stor omsorg handplockat gårdar som värnar om sina marker och sin närmiljö, eller som en vinodlare
             brukar säga ”det växer ogräs mellan rankorna, det är bra”.</p>
          <p>För att göra det smidigt och lätt för dessa små gårdar, så har vi tillsammans med gården tagit fram blandade
             lådor som vi hoppas att Ni kommer att älska!</p>
          <p>Detta är vår passion och våra vänner vi jobbar med!</p>
          <p>// Pernilla & Johan</p>

          <img 
            src={`${process.env.PUBLIC_URL}/images/regions/packaging3.png`} 
            alt="Vingård" 
            className="instructions-image"
          />
      </div>
    );
  }
  
  export default InstructionsPage;