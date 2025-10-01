export function renderBlockToHtml(block) {
    switch (block.type) {
      case "text":
        return `
          <tr>
            <td style="padding: 10px 20px; font-size: 16px; line-height: 1.5; color: #333;">
              ${block.content || ""}
            </td>
          </tr>
        `;
  
      case "image":
        return `
          <tr>
            <td style="padding: 20px; text-align: center;">
              <img src="${block.url || ""}" 
                   alt="${block.alt || ""}" 
                   style="max-width:100%; width:${block.width || 100}%; height:auto; border-radius:6px;" />
            </td>
          </tr>
        `;

        case "productGrid":
        const productHtml = [block.product1, block.product2]
            .map((p) =>
            p
                ? `
                <td style="width:50%; padding:10px; text-align:center; vertical-align:top;">
                    <a href="https://baravin.nu/collections/lazio" target="_blank" style="text-decoration:none; color:#333;">
                    <img src="https://baravin.nu/cdn/shop/collections/Liguria.png?v=1701176102&width=750" alt="${p.name}" style="max-width:100%; border-radius:6px;" />
                    <p style="margin-top:10px; font-size:14px; font-weight:bold;">${p.name}</p>
                    </a>
                </td>
                `
                : `<td style="width:50%; padding:10px; text-align:center; vertical-align:top;"><em>Ingen produkt</em></td>`
            )
            .join("");

        return `
            <tr>
            <td style="padding:0 20px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    ${productHtml}
                </tr>
                </table>
            </td>
            </tr>
        `;



  
      case "button":
        return `
          <tr>
            <td style="padding: 20px; text-align: center;">
              <a href="${block.url || "#"}"
                 style="display:inline-block; padding:12px 24px;
                        background:#5c1a1a; color:#ffffff; text-decoration:none;
                        font-size:16px; border-radius:5px;">
                ${block.text || "Klicka här"}
              </a>
            </td>
          </tr>
        `;
  
      case "link":
        return `
          <tr>
            <td style="padding: 10px 20px; font-size: 16px; line-height: 1.5;">
              <a href="${block.url || "#"}" style="color:#5c1a1a; text-decoration:underline;">
                ${block.text || "Länk"}
              </a>
            </td>
          </tr>
        `;
  
      case "divider":
        return `
          <tr>
            <td style="padding: 10px 20px;">
              <hr style="border:0; border-top:1px solid #ddd; margin:20px 0;" />
            </td>
          </tr>
        `;
  
      case "spacer":
        return `
          <tr>
            <td style="height:${block.height || 20}px;">&nbsp;</td>
          </tr>
        `;
  
      default:
        return "";
    }
  }
  
  export function renderNewsletterHtml(blocks) {
    const content = blocks.map((b) => renderBlockToHtml(b)).join("");
  
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Nyhetsbrev</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f7f7f7;">
          <center style="width:100%; background-color:#f7f7f7; padding:20px 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" 
                   style="max-width:600px; width:100%; background:#ffffff; border-radius:8px; overflow:hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background:#5c1a1a; color:#fff; text-align:center; padding:20px; font-size:20px;">
                  Bara Vin
                </td>
              </tr>
              
              <!-- Content blocks -->
              ${content}
  
              <!-- Footer -->
              <tr>
                <td style="padding:20px; font-size:12px; color:#777; text-align:center; line-height:1.4;">
                  Du får detta mail från Bara Vin.<br/>
                  Vill du inte ha fler utskick?
                  <a href="{{unsubscribe_link}}" style="color:#800000;">Avregistrera dig här</a>.
                  <br/><br/>
                  <strong>Bara Vin</strong><br/>
                  Vino Italiano di P.B.J<br/>
                  Alba (CN) Piazza Garibaldi 3 CAP 12051<br/>
                  info@baravin.nu
                </td>
              </tr>
            </table>
          </center>
        </body>
      </html>
    `;
  }
  