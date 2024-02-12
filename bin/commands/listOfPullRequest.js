import { Octokit } from "@octokit/rest";
import axios from "axios";
import { readTokenFromFile } from "./install.js";

const listOfPullRequest = async (repo) => {
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

  getPullRequest(owner, repo, token);
};

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

async function getPullRequest(owner, repo, token) {
  try {
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
  } catch (error) {
    console.log(
      "Error in fetching PR: ",
      error?.response?.data?.message || error?.message
    );
  }
}

export { listOfPullRequest };
