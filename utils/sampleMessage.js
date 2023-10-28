const base64Message = (subject, from, to) => {
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
  const sampleMessageParts = [
    `From: ${from}`,
    `To: ${to}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    `Subject: ${utf8Subject}`,
    "",
    "This is a message just to say hello.",
    "So... <b>Hello!</b>  🤘❤️😎",
  ];
  const message = sampleMessageParts.join("\n");

  // makeing url safe
  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return encodedMessage;
};

module.exports = base64Message;
