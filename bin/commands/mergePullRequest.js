import { Octokit } from "@octokit/rest";
import { readTokenFromFile } from "../utils/handleToken.js";
import { getOwner } from "../utils/getOwner.js";

async function mergePullRequest(repo, pr) {
  const token = readTokenFromFile();
    if (!token) {
      console.log("Token not found. Please install the bot first.");
      return;
    }

  const owner = await getOwner(token);
  if (!owner) {
    console.log("Owner not found.");
    return;
  }
  mergePullRequestToRepo(owner, repo, pr, token);
}

async function mergePullRequestToRepo(owner, repo, pr, token) {
  try {
    const octokit = new Octokit({
      auth: token,
    });
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
    console.log("Pull Request merged successfully");
  } catch (error) {
    console.log(
      "Error in merging pull request:",
      error?.message || error?.response?.data?.message
    );
    return;
  }
}

export { mergePullRequest };
