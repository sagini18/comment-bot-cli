import { Octokit } from "@octokit/rest";
import axios from "axios";
import { readTokenFromFile } from "./install.js";

const listOfPullRequest = async (repo) => {
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
  if (!userData) {
    console.log("User not found. Please install the bot first.");
    return;
  }
  const owner = userData.data?.login;

  const octokit = new Octokit({
    auth: token,
  });

  const pullRequestData = await octokit?.request(
    "GET /repos/{owner}/{repo}/pulls",
    {
      owner,
      repo,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  if (pullRequestData?.data?.length === 0) {
    console.log("No pull requests found");
    return;
  }
  var pullRequestDataArray = [];
  pullRequestData.data?.forEach((element) => {
    pullRequestDataArray.push({
      title: element.title,
      number: element.number,
      body: element.body,
    });
  });
  console.table(pullRequestDataArray);

  if (pullRequestData.status === 401 || userData.status === 401) {
    console.log("Invalid token. Please install the bot again.");
    return;
  }
};

export { listOfPullRequest };