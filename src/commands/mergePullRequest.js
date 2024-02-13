import { Octokit } from "@octokit/rest";
import { readTokenFromFile } from "../utils/handleToken.js";
import { getOwner } from "../utils/getOwner.js";
import { logger } from "../utils/logError.js";

async function mergePullRequest(repo, pr) {
  try {
    const token = readTokenFromFile();
    if (!token) {
      throw new Error("Token not found. Please install the bot first.");
    }

    const owner = await getOwner();
    if (!owner) {
      throw new Error("Owner not found");
    }

    mergePullRequestToRepo(owner, repo, pr, token);
  } catch (error) {
    logger.error({
      message: `Error in merging pull request : ${error?.message}`,
    });
  }
}

async function mergePullRequestToRepo(owner, repo, pr, token) {
  try {
    const octokit = new Octokit({
      auth: token,
    });
    if (!octokit) {
      throw new Error("Error in creating octokit instance");
    }

    await octokit?.request(
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge",
      {
        owner: owner,
        repo: repo,
        pull_number: pr,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    logger.info("Pull Request merged successfully");
  } catch (error) {
    logger.error({
      message: `Error in merging pull request : ${
        error?.response?.data?.message || error?.message
      }`,
    });
  }
}

export { mergePullRequest };
