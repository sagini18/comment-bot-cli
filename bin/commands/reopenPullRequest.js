import { Octokit } from "@octokit/rest";
import axios from "axios";
import { readTokenFromFile } from "./install.js";

async function reopenPullRequest(repo, pr) {
  const token = readTokenFromFile();
  if (!token) {
    console.log("Token not found. Please install the bot first.");
    return;
  }
  const owner = await getOwner(token);
  if (!owner) {
    console.log("Owner not found");
    return;
  }

  reopenPullRequestUsingOctokit(owner, repo, pr, token);
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
    console.log(
      "Error in fetching user data: ",
      error?.response?.data?.message || error?.message
    );
  }
}

async function reopenPullRequestUsingOctokit(owner, repo, pr, token) {
  try {
    const octokit = new Octokit({ auth: token });
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

    console.log(
      "Pull Request reopened successfully\nView the pull request at:\n",
      reopenResponse.data.html_url
    );
  } catch (error) {
    console.log(
      "Error in reopening pull request: ",
      error?.response?.data?.message || error?.message
    );
  }
}

export { reopenPullRequest };
