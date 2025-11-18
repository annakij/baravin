import "./Products.css";

function InformationTab() {
    return (
        <div className="tab-content">
        <h1>Information / kravhantering vid ändring av information</h1>
        <div className="admin-information-tab">

        {/* REGIONINFORMATION */}
        <h3>Regioner</h3>
        <p>Regioner används som övergripande kategorier för vingårdar och vinboxar. 
            Att ändra namn eller beskrivning på en region påverkar endast hur den visas på hemsidan 
            - inga ordrar eller produkter påverkas direkt. <strong>Här rekommenderas tillägg vid ytterliggare information
            om eventuella förseningar eller annat för att förmedla till kund</strong></p>
        <p>Du kan tryggt uppdatera namn eller beskrivning om det är en stavning eller textjustering. 
            Om du däremot planerar att ta bort en region, se till att flytta eller ta bort alla vingårdar som ligger under den först. 
            En region som innehåller vingårdar kan inte tas bort förrän de är flyttade eller raderade.</p>
        
        {/* VINGÅRDSINFORMATION */}
        <h3>Vingårdar</h3>
        <p>Vingårdar hör alltid till en region, och varje vingård innehåller ett antal vinboxar.
            Att ändra namn, adress eller kontaktuppgifter för en vingård påverkar hur den visas i produktsidor och ordrar.
            Om en kund har beställt en vinbox från en viss vingård, och du byter namn på vingården, 
            kommer det nya namnet att visas även på gamla ordrar (eftersom ordern oftast visar “live-data” från produkten).</p>
        <p><strong>Rekommendation:</strong></p>
        <p>Mindre textändringar (t.ex. e-post eller adress) går bra. 
            Större förändringar, som att vingården byter ägare eller flyttas till annan region, 
            bör göras genom att skapa en ny vingård och markera den gamla som inaktiv.
            Vingården markeras som inaktiv genom att nolla kvantitet på innehållande vinboxar
            och göms därmed från hemsidan.</p>
        <p>Om du behöver ta bort en vingård, se till att alla vinboxar under den är flyttade eller raderade först. 
            En vingård som innehåller vinboxar kan inte tas bort förrän de är flyttade eller raderade.
            Om vingården har boxar som redan existerar i genomförda ordrar rekommenderas det även här att istället
            göra den inaktiv för att förhindra problem i orderhistorik.</p>
        
        {/* VINBOXINFORMATION */}
        <h3>Vinboxar</h3>
        <p>Vinboxar är de produkter som kunderna kan köpa. Varje vinbox är kopplad till en vingård och en region.
            Att ändra namn, beskrivning, pris eller innehåll i en vinbox påverkar hur den visas på produktsidan och i ordrar.
            Om en kund har beställt en viss vinbox, och du ändrar dess namn eller innehåll, 
            kommer det nya namnet och innehållet att visas även på gamla ordrar (eftersom ordern oftast visar “live-data” från produkten).</p>
        <p><strong>Krav på aktiv vinbox:</strong></p>
        <p>1. Endast vinboxar innehållande 6 flaskor syns på hemsidan.</p>
        <p>2. Endast vinboxar med en kvantitet över 0 syns på hemsidan.</p>
        <p><strong>Rekommendation:</strong></p>
        <p>Mindre ändringar som att uppdatera beskrivning eller pris går bra. 
            Större förändringar, som att byta ut viner i boxen eller ändra boxens tema, 
            bör göras genom att skapa en ny vinbox och markera den gamla som inaktiv. Detta görs genom att nolla kvantitet.</p>
        <p>Om du behöver ta bort en vinbox, går endast detta om den inte redan är kopplad till en genomförd order. 
            En vinbox som är del av en order kan inte tas bort, gör istället vinboxen inaktiv och skapa en ny.</p>
        
        <h3>Sammanfattning</h3>
        <ul>
            <li>Små textändringar är oftast säkra att göra direkt.</li>
            <li>Större förändringar bör hanteras genom att skapa nya poster och markera gamla som inaktiva.</li>
            <li>Se alltid till att inga aktiva ordrar påverkas negativt av dina ändringar.</li>
            <li>Vid osäkerhet, rådgör med teamet innan du gör större ändringar.</li>
        </ul>
        <p>Genom att följa dessa riktlinjer kan du säkerställa att produktinformationen förblir korrekt och att kundernas upplevelse inte påverkas negativt av ändringar i systemet.</p>
        <p>Om du har frågor eller behöver hjälp, tveka inte att kontakta utvecklingsteamet.</p>
        <br />
        <br />
        </div>
        </div>
    );
    }
    export default InformationTab;