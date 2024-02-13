import { Octokit } from "@octokit/rest";
import { readTokenFromFile } from "../utils/handleToken.js";
import { getOwner } from "../utils/getOwner.js";
import { logger } from "../utils/logError.js";

async function reopenPullRequest(repo, pr) {
  try {
    const token = readTokenFromFile();
    if (!token) {
      throw new Error("Token not found. Please install the bot first.");
    }
    const owner = await getOwner();
    if (!owner) {
      throw new Error("Owner not found");
    }

    reopenPullRequestUsingOctokit(owner, repo, pr, token);
  } catch (error) {
    logger.error({
      message: `Error in reopening pull request : ${error?.message}`,
    });
  }
}

async function reopenPullRequestUsingOctokit(owner, repo, pr, token) {
  try {
    const octokit = new Octokit({ auth: token });
    if (!octokit) {
      throw new Error("Error in creating octokit instance");
    }

    const reopenResponse = await octokit?.request(
      "PATCH /repos/{owner}/{repo}/pulls/{pull_number}",
      {
        owner,
        repo,
        pull_number: pr,
        state: "open",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    logger.info(
      `Pull Request reopened successfully\nView the pull request at:\n ${reopenResponse.data?.html_url}`
    );
  } catch (error) {
   logger.error({
      message: `Error in reopening pull request : ${
        error?.response?.data?.message || error?.message
      }`,
    });
  }
}

export { reopenPullRequest };
