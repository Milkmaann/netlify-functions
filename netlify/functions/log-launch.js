exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Použij POST" };
  }

  const data = JSON.parse(event.body);

  console.log("Data z apky:", {
    ip: event.headers["x-forwarded-for"] || "unknown",
    computerName: data.computerName,
    macAddress: data.macAddress,
    timestamp: data.timestamp
  });

  // Tady můžeš přidat uložení do DB, email, atd.

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Data přijata" }),
  };
};
