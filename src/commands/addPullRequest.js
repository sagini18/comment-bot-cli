import { Octokit } from "@octokit/rest";
import { readTokenFromFile } from "../utils/handleToken.js";
import { getOwner } from "../utils/getOwner.js";
import { logger } from "../utils/logError.js";

async function addPullRequest(repo, title, body, head, base) {
  try {
    const token = readTokenFromFile();
    if (!token) {
      throw new Error("Token not found. Please install the bot first.");
    }

    const owner = await getOwner();
    if (!owner) {
      throw new Error("Owner not found.");
    }

    addPullRequestToRepo(owner, repo, title, body, head, base, token);
  } catch (error) {
    logger.error({
      message: `Error in adding pull request : ${error?.message}`,
    });
  }
}

async function addPullRequestToRepo(
  owner,
  repo,
  title,
  body,
  head,
  base,
  token
) {
  try {
    const octokit = new Octokit({
      auth: token,
    });
    const addprResponse = await octokit?.request(
      "POST /repos/{owner}/{repo}/pulls",
      {
        owner,
        repo,
        title,
        body,
        head,
        base,
      }
    );
    logger.info(
      `Pull Request added successfully\nView the pull request at:\n ${addprResponse.data?.html_url}`
    );
  } catch (error) {
    logger.error({
      message: `Error in adding pull request : ${
        error?.response?.data?.message || error?.message
      }`,
    });
    return;
  }
}

export { addPullRequest };
