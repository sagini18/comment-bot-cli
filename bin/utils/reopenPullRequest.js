import { Octokit } from "@octokit/rest";
import axios from "axios";
import { readTokenFromFile } from "./install.js";

async function reopenPullRequest(repo, pr) {
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
  if (reopenResponse.status != 200) {
    console.log("Something went wrong in reopening pull request.");
    return;
  }

  console.log(
    "Pull Request reopened successfully\nView the pull request at:\n",
    reopenResponse.data.html_url
  );
}

export { reopenPullRequest };
