import { Octokit } from "@octokit/rest";
import { readTokenFromFile } from "../utils/handleToken.js";
import { getOwner } from "../utils/getOwner.js";
import { logger } from "../utils/logError.js";

const listOfPullRequest = async (repo) => {
  try{
  const token = readTokenFromFile();
  if (!token) {
    throw new Error("Token not found. Please install the bot first.");
  }

  const owner = await getOwner();
  if (!owner) {
    throw new Error("Owner not found");
  }

  getPullRequest(owner, repo, token);
  }catch(error){
    logger.error({
      message: `Error in fetching pull request : ${error?.message}`,
    });
  }
};

async function getPullRequest(owner, repo, token) {
  try {
    const octokit = new Octokit({
      auth: token,
    });
    const pullRequestData = await octokit?.request(
      "GET /repos/{owner}/{repo}/pulls",
      {
        owner,
        repo,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (pullRequestData?.data?.length === 0) {
      logger.info("No pull requests found");
      return;
    }
    var pullRequestDataArray = [];
    pullRequestData.data?.forEach((element) => {
      pullRequestDataArray.push({
        title: element.title,
        number: element.number,
        body: element.body,
      });
    });
    console.table(pullRequestDataArray);
  } catch (error) {
    logger.error({
      message: `Error in fetching pull request : ${
        error?.response?.data?.message || error?.message
      }`,
    });
  }
}

export { listOfPullRequest };
