import { useState } from "react";
import { MessageCircleHeart, Send, X } from "lucide-react";
import "./WhatsAppChatt.css";

function WhatsAppChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Admins number in international format without '+' or '00'
  // Example: Sweden +46 -> 46701234567
  const adminNumber = "46737684767"; 

  const handleSend = () => {
    if (!message.trim()) return;

    const prefix = "BaraVin:";
    const finalMessage = `${prefix} ${message}`;
    const url = `https://wa.me/${adminNumber}?text=${encodeURIComponent(finalMessage)}`;

    // Opens WhatsApp (mobil or web)
    window.open(url, "_blank");

    setMessage("");
    setOpen(false);
  };

  return (
    <div className="whatsapp-widget">
      {open ? (
        <div className="chat-box">
          <h3 className="chat-title">Chatta med oss!</h3>
          <p>Hej! Hur kan jag hjälpa dig?<br/>Johan - Sommelier</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Skriv meddelande..."
            className="chat-textarea"
            rows={3}
          />
          <div className="chat-actions">
            <a onClick={() => setOpen(false)} className="btn-close">
              <X size={24}/>Stäng
            </a>
            <a onClick={handleSend} className="btn-send">
            <Send size={24} />Skicka via WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <a onClick={() => setOpen(true)} className="chat-toggle">
        <MessageCircleHeart size={30} /> <p className="toggle-text">Behöver du hjälp?</p>
        </a>
      )}
    </div>
  );
}

export default WhatsAppChat;
