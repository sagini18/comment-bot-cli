import { Octokit } from "@octokit/rest";
import axios from "axios";
import { readTokenFromFile } from "./install.js";

async function addPullRequest(repo, title, body, head, base) {
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

  addPullRequestToRepo(owner, repo, title, body, head, base, token);
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
    console.log(
      "Pull Request added successfully\nView the pull request at:\n",
      addprResponse.data?.html_url
    );
  } catch (error) {
    console.log(
      "Error in adding pull request:",
      error?.response?.data?.message || error?.message
    );
    return;
  }
}

export { addPullRequest };
