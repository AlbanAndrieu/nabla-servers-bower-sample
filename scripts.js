/* eslint-disable max-len */
/* eslint-disable require-jsdoc */


function getEncapsulatingDatesEnvVar () {
  const newDate = new Date(new Date().getTime() - 86400000);
  const regexpDate = /(\d{4}-\d{2}-\d{2})/;
  const regexpDateWithTime = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/;

  let logStartDate = getEnvVar(
    "STARTING_DATE",
    `${newDate.toISOString().substring(0, 10)}`
  );
  let logEndDate = getEnvVar(
    "ENDING_DATE",
    `${newDate.toISOString().substring(0, 10)}`
  );
  if (regexpDate.test(logStartDate)) {
    logStartDate += " 00:00:00";
  }
  if (regexpDate.test(logEndDate)) {
    logEndDate += " 23:59:59";
  }

  if (!regexpDateWithTime.test(logStartDate)) {
    console.error(
      `The format of STARTING_DATE env var must be YYYY-MM-DD or YYYY-MM-DD HH:MM:SS, given '${logStartDate}'`
    );
    process.exit(1);
  }
  if (!regexpDateWithTime.test(logEndDate)) {
    console.error(
      `The format of ENDING_DATE env var must be YYYY-MM-DD or YYYY-MM-DD HH:MM:SS, given '${logEndDate}'`
    );
    process.exit(1);
  }
  return { logsStartingAt: logStartDate, logsEndingBefore: logEndDate };
}

// Verify if all env_var exist or exit(1);
function getEnvVar (varName, defaultValue) {
  if (process.env[varName] && process.env[varName].length > 0) {
    return process.env[varName];
  }
  if (typeof defaultValue !== "undefined") {
    return defaultValue;
  }
  console.error(`Env Var '${varName} doesn't exist`);
  process.exit(1);
}

const { logsStartingAt, logsEndingBefore } = getEncapsulatingDatesEnvVar();

async function main () {
  console.info("-->Starting process");
  // const { logsStartingAt, logsEndingBefore } = getEncapsulatingDatesEnvVar();
  console.info(`[Process of the last login users from ${logsStartingAt} to ${logsEndingBefore}`);

  console.info("End process");
  process.exit(0);
}

main();
