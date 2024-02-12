import { Octokit } from "@octokit/rest";
import axios from "axios";
import { readTokenFromFile } from "./install.js";

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

async function getOwner(token) {
  try {
    const userData = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    const owner = userData.data?.login;
    return owner;
  } catch (error) {
    console.log("Error in fetching user data:", error?.response?.data?.message || error?.message);
    return;
  }
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
