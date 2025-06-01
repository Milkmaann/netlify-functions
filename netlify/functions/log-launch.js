const { google } = require('googleapis');
const sheets = google.sheets('v4');
const { GoogleAuth } = require('google-auth-library');

const auth = new GoogleAuth({
  keyFile: './zinc-transit-461610-n3-93822ca2af8f.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const spreadsheetId = '1s4Dw0ifvSC7INeJcMAma1UaTjHTaniX0Cf61r7s6APY'; // ID tvého sešitu

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Použij POST',
    };
  }

  const data = JSON.parse(event.body);
  const client = await auth.getClient();

  try {
    await sheets.spreadsheets.values.append({
      auth: client,
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          new Date().toISOString(),
          data.computerName || 'unknown',
          data.macAddress || 'unknown'
        ]]
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data úspěšně zapsána do Google Sheets' }),
    };

  } catch (error) {
    console.error('Chyba zápisu do tabulky:', error);
    return {
      statusCode: 500,
      body: 'Chyba při zápisu do tabulky',
    };
  }
};
