import { Octokit } from "@octokit/rest";
import { readTokenFromFile } from "../utils/handleToken.js";
import { getOwner } from "../utils/getOwner.js";
import { logger } from "../utils/logError.js";

async function closePullRequest(repo, pr) {
  try {
    const token = readTokenFromFile();
    if (!token) {
      throw new Error("Token not found. Please install the bot first.");
    }

    const owner = await getOwner();
    if (!owner) {
      throw new Error("Owner not found");
    }

    closePullRequestUsingOctokit(owner, repo, pr, token);
  } catch (error) {
    logger.error({
      message: `Error in closing pull request : ${error?.message}`,
    });
  }
}

async function closePullRequestUsingOctokit(owner, repo, pr, token) {
  try {
    const octokit = new Octokit({
      auth: token,
    });
    const closeprResponse = await octokit?.request(
      "PATCH /repos/{owner}/{repo}/pulls/{pull_number}",
      {
        owner,
        repo,
        pull_number: pr,
        state: "closed",
      }
    );
    logger.info(
      `Pull Request closed successfully\nView the pull request at:\n ${closeprResponse.data?.html_url}`
    );
  } catch (error) {
    logger.error({
      message: `Error in closing pull request : ${
        error?.response?.data?.message || error?.message
      }`,
    });
  }
}

export { closePullRequest };
