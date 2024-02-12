import { App } from "octokit";
import axios from "axios";
import { readTokenFromFile } from "./install.js";
import fs from "fs";
import { generateJWT } from "../utils/generateJWT.js";

async function addComment(repo, pr, comment) {
  const owner = await getOwner();

  const installationId = await getInstallationId(owner, repo);

  const octokit = await getOctokit(installationId);

  const payload = {
    owner,
    repo,
    pr_number: pr,
    comment,
  };

  handlePullRequestOpened(octokit, payload);
}

async function getOwner() {
  const token = readTokenFromFile();
  if (!token) {
    console.log("Token not found. Please install the bot first.");
    return;
  }

  try {
    const userData = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    const owner = userData.data?.login;
    return owner;
  } catch (error) {
    console.log("Error in fetching user data:", error.response.data.message);
    return;
  }
}

async function getInstallationId(owner, repo) {
  const jwtToken = generateJWT();

  try {
    const installationIdReponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/installation`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    const installationId = installationIdReponse.data?.id;
    return installationId;
  } catch (error) {
    console.log(
      "Error in fetching installation id:",
      error.response.data.message
    );
    return;
  }
}

async function getOctokit(installationId) {
  const appId = process.env.APP_ID;
  const privateKeyPath = process.env.PRIVATE_KEY_PATH;

  const privateKey = fs.readFileSync(privateKeyPath, "utf8");

  const app = new App({
    appId: appId,
    privateKey: privateKey,
  });

  const octokit = await app.getInstallationOctokit(installationId);
  return octokit;
}

async function handlePullRequestOpened(octokit, payload) {
  try {
    const commentsResponse = await octokit?.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: payload.owner,
        repo: payload.repo,
        issue_number: payload.pr_number,
        body: payload.comment,
      }
    );

    console.log(
      "Comment added successfully\nView the comment at:\n",
      commentsResponse?.data?.html_url
    );
  } catch (error) {
    console.log("Error in adding comment:", error.response.data.message);
  }
}

export { addComment };
