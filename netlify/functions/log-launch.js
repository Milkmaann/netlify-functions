const { google } = require('googleapis');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Použij POST' };
  }

  const data = JSON.parse(event.body);

  // Nastavení OAuth2 klienta (tady použijeme službu s klíčem)
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    keyFile: './credentials.json'  // sem dáš stažený JSON s přístupem (viz níže)
  });

  const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });

  const spreadsheetId = 'TAD_VLOŽ_ID_TVÉ_TABULKY'; // z URL Google Sheets
  const range = 'List1!A:D'; // kam se budou data zapisovat

  // Připrav data k zápisu
  const values = [
    [
      event.headers['x-forwarded-for'] || 'unknown',
      data.computerName,
      data.macAddress,
      data.timestamp
    ],
  ];

  const resource = {
    values,
  };

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS'
      resource,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data uložena do Google Sheets' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Chyba při ukládání', error: error.message }),
    };
  }
};
