import { Octokit } from "@octokit/rest";
import axios from "axios";
import { readTokenFromFile } from "./install.js";

async function addPullRequest(repo, title, body, head, base) {
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
  if (addprResponse.status != 201) {
    console.log("Something went wrong in adding pull request.");
    return;
  }

  console.log(
    "Pull Request added successfully\nView the pull request at:\n",
    addprResponse.data.html_url
  );
}

export { addPullRequest };
