exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Použij POST" };
  }

  const data = JSON.parse(event.body);

  // Vracíme přesně ta data, která přišla
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Data přijata",
      receivedData: {
        ip: event.headers["x-forwarded-for"] || "unknown",
        computerName: data.computerName,
        macAddress: data.macAddress,
        timestamp: data.timestamp
      }
    }),
  };
};
