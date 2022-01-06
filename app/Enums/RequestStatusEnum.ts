const Enum = require("adonis-enum");

const RequestStatusEnum = new Enum({
  STARTED: "started",
  FINISHED: "finished",
  PENDING: "pending",
});

export default RequestStatusEnum;
