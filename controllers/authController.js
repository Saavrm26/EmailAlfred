const catchAsync = require("../utils/catchAsync");
const ClientQueue = require("../workers/replyWorker");

const authCallBack = catchAsync(async (req, res, next) => {
  const { code } = req.query;
  // offload sending replies to worker
  await ClientQueue.add("Clients", { code });
  res.render("success");
});

module.exports = { authCallBack };
