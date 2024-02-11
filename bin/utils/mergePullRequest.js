import { Octokit } from "@octokit/rest";
import axios from "axios";
import { readTokenFromFile } from "./install.js";

async function mergePullRequest(repo, pr) {
  const token = readTokenFromFile();
  if (!token) {
    console.log("Token not found. Please install the bot first.");
    return;
  }

  const userData = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  if (userData.status != 200) {
    console.log("Something went wrong in fetching user data.");
    return;
  }
  const owner = userData.data?.login;

  const octokit = new Octokit({
    auth: token,
  });
  const mergeResponse = await octokit?.request(
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
  if (mergeResponse.status != 200) {
    console.log("Something went wrong in merging pull request.");
    return;
  }
  console.log("Pull Request merged successfully");
}

export { mergePullRequest };