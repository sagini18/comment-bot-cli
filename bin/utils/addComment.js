import { Octokit } from "@octokit/rest";
import axios from "axios";
import { readTokenFromFile } from "./install.js";

async function addComment(repo, pr, comment) {
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

  const commentsResponse = await octokit?.request(
    "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
    {
      owner: owner,
      repo: repo,
      issue_number: pr,
      body: comment,
    }
  );
  if (commentsResponse.status != 201) {
    console.log("Something went wrong in adding comment.");
    return;
  }
  console.log(
    "Comment added successfully\nView the comment at:\n",
    commentsResponse.data.html_url
  );
}

export { addComment };
