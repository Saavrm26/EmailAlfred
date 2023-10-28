const { Queue, Worker } = require("bullmq");
const redisConnection = require("./redis-connection");
const keys = require("../oauth2/oauth2Keys");
const randInt = require("../utils/randomTime");
const base64Message = require("../utils/sampleMessage");

const ClientQueue = new Queue("Clients", {
  connection: redisConnection,
});

const createLabel = async (gmail, name) => {
  const res = await gmail.users.labels.create({
    userId: "me",
    requestBody: {
      name,
    },
  });
  return res.data.id;
};

const addLabel = async (messageId, labelId, gmail) => {
  await gmail.users.messages.modify({
    userId: "me",
    id: messageId,
    requestBody: {
      addLabelIds: [labelId],
    },
  });
};

const sendReply = async (messageThreadId, subject, from, to, gmail) => {
  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      threadId: messageThreadId,
      raw: base64Message(subject, from, to),
    },
  });
  return res.data.id;
};

/**
 * Iterates over messages sent in a thread
 * Returns `{id, subject, from, to}` of the converation
 */
const checkoutThread = async (id, gmail) => {
  const res = await gmail.users.threads.get({ id, userId: "me" });
  const { messages } = res.data;
  const replied = messages.find((message) =>
    message.labelIds.find((value) => {
      if (value !== "SENT") return false; // Messages that haven't been sent by user
      if (messages.length === 1) return false; // Messages that are sent by user to user
      return true;
    }),
  );
  if (replied) return {};
  const subject = messages[0].payload.headers.find(
    (value) => value.name === "Subject",
  );
  const to = messages[0].payload.headers.find((value) => value.name === "To");
  const from = messages[0].payload.headers.find(
    (value) => value.name === "From",
  );
  return { id, subject: subject.value, from: from.value, to: to.value };
};

const getUnrepliedThreads = async (gmail) => {
  const res = await gmail.users.threads.list({ userId: "me" });
  const { threads } = res.data;
  const threadPromises = threads.map((thread) =>
    checkoutThread(thread.id, gmail),
  );
  let unreplied = await Promise.all(threadPromises);
  unreplied = unreplied.filter((value) => value.id !== undefined);
  return unreplied;
};

/**
 * routine consists of 3 steps:
 * 1. Find all emails that are unreplied
 * 2. Sending Replies to these threads
 * 3. Adding these message to a new label group
 */
const routine = async (gmail, newLabelId) => {
  const unreplied = await getUnrepliedThreads(gmail);

  const replyPromises = unreplied.map((value) =>
    sendReply(value.id, value.subject, value.to, value.from, gmail),
  );

  const replyMessageId = await Promise.all(replyPromises);
  const addLabelPromises = replyMessageId.map((id) =>
    addLabel(id, newLabelId, gmail),
  );
  await Promise.all(addLabelPromises);
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const replyJobHandler = async (data) => {
  // Creating new oauth2client for every user
  const { google } = require("googleapis");
  const { code } = data;
  const oauth2Client = new google.auth.OAuth2(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uris[0],
  );

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  google.options({ auth: oauth2Client });

  const gmail = google.gmail("v1");
  // creating a new label based to the time we are going to reply to emails
  const currTime = new Date();
  const newLabelId = await createLabel(
    gmail,
    `AlfredHandledIt-${currTime.toLocaleTimeString()}`,
  );

  while (true) {
    await routine(gmail, newLabelId);
    const n = randInt(45, 120) * 1000;
    await sleep(n);
  }
};

const worker = new Worker(
  "Clients",
  async (job) => {
    replyJobHandler(job.data);
  },
  {
    connection: redisConnection,
  },
);

module.exports = ClientQueue;
