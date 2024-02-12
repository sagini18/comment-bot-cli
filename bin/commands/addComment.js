import axios from "axios";
import fs from "fs";
import { App } from "octokit";
import { generateJWT } from "../utils/generateJWT.js";
import { logger } from "../utils/logError.js";
import { getOwner } from "../utils/getOwner.js";

async function addComment(repo, pr, comment) {
  const owner = await getOwner();
  if (!owner) {
    logger.error({message: "Owner noot found"})
    return;
  }

  const installationId = await getInstallationId(owner, repo);
  if (!installationId) {
    logger.error({message:"Installation id not found."});
    return;
  }

  const octokit = await getOctokit(installationId);
  if (!octokit) {
    logger.error({message:"Octokit not found."});
    return;
  }

  const payload = {
    owner,
    repo,
    pr_number: pr,
    comment,
  };

  handlePullRequestOpened(octokit, payload);
}

async function getInstallationId(owner, repo) {
  try {
    const jwtToken = generateJWT();
    if (!jwtToken) {
      logger.error({message:"JWT token not found."});
      return;
    }

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
    logger.error({message:`Error in fetching installation id : ${error?.response?.data?.message}`});
    return;
  }
}

async function getOctokit(installationId) {
  try {
    const appId = process.env.APP_ID;
    const privateKeyPath = process.env.PRIVATE_KEY_PATH;

    const privateKey = fs.readFileSync(privateKeyPath, "utf8");

    const app = new App({
      appId: appId,
      privateKey: privateKey,
    });

    const octokit = await app.getInstallationOctokit(installationId);
    return octokit;
  } catch (error) {
    logger.error({message:`Error in getting octokit : ${error?.response?.data?.message}`});
    return;
  }
}

async function handlePullRequestOpened(octokit, payload) {
  if (!octokit) {
    logger.error({message:"Octokit not found."});
    return;
  }

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
    logger.error({message:`Error in adding comment : ${error?.response?.data?.message}`});
    return;
  }
}

export { addComment };
