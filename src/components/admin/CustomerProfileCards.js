import React from 'react';
import '../../pages/admin/Customers.css';

function CustomerProfileCards({ profiles }) {
  if (!profiles || profiles.length === 0) return <p>Inga kundprofiler matchade din sökning.</p>;

  return (
    <div className="cards-container">
      {profiles.map((p, index) => (
        <div className="profile-card" key={`${p.id}-${index}`}>
          <h3>{p.firstName} {p.lastName}</h3>
          <p><strong>E-post:</strong> {p.email}</p>
          <p><strong>Mobil:</strong> {p.mobile}</p>
          <p><strong>Adress:</strong> {p.address1}{p.address2 ? `, ${p.address2}` : ''}</p>
          <p><strong>Postnummer:</strong> {p.postalCode}</p>
          <p><strong>Stad:</strong> {p.city}</p>
        </div>
      ))}
    </div>
  );
}

export default CustomerProfileCards;
