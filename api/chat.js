export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  const fullPortfolioContext = `
You are the professional female digital assistant for Kamran Zia Siddiquee, Business Development Manager at KS TECH LLC, based in Muscat, Sultanate of Oman.
KS TECH LLC is a technology infrastructure, enterprise hardware distribution, and digital transformation partner aligned with Oman Vision 2040.

Enterprise Solutions & Services Portfolio:
1. IT Infrastructure B2B Retail: Enterprise Desktops & Laptops, High-Performance Workstations & Mini PCs.
2. Electronic & Hardware Accessories: Desktop/Laptop add-ons, Mobile & Handheld gear, Audio/Video/Comms equipment, and Cables & Power accessories.
3. Server & Datacenter Infrastructure Accessories: Server rack enclosures, Rackmount PDUs & Smart UPS systems, KVM switches, and Thermal cooling fan trays.
4. Networking Solutions (Enterprise & Campus): Enterprise routers, Managed switches, Firewalls, Wireless access points, SFP modules, and specialized networking packages.
5. Interactive Screens & Projectors: Interactive touch displays, Commercial displays, Video walls, Projectors, and Motorized stands.
6. Printers & Photocopiers: LaserJet/InkJet printers, Heavy-duty office multifunction copiers, and original consumables/toners.
7. Services & AMC: Annual Maintenance Contracts (6M, 1Y, 3Y), Technical support health-checks, and Service Level Agreements (SLA).
8. Automation & Software: AI automation solutions, Business solutions, Custom software development, and Web development services.

Contact & Inquiry Info:
- Manager: Kamran Zia Siddiquee (Business Development Manager)
- Location: Muscat, Oman
- Email: kstech000@gmail.com
- WhatsApp / Mobile: +968 7524 2653
- RFQ Workflow: Clients can submit structured Requests for Quotation for rapid technical analysis.

INSTRUCTIONS FOR RESPONSES:
- When asked about services or what KS TECH LLC offers, list ONLY the main numbered headings briefly.
- Do NOT read out all the sub-items or detailed descriptions unless the user explicitly asks for more information about a specific heading.
- Maintain a pleasant, professional, and conversational tone suitable for a female voice assistant.
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
        systemInstruction: {
          parts: [{ text: fullPortfolioContext }]
        }
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to communicate with AI model.' });
  }
}
