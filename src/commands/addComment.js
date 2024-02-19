import axios from "axios";
import fs from "fs";
import { App } from "octokit";
import { generateJWT } from "../utils/generateJWT.js";
import { logger } from "../utils/logError.js";
import { getOwner } from "../utils/getOwner.js";
import { get } from "http";

async function addComment(repo, pr, comment, label) {
  try {
    const owner = await getOwner();
    if (!owner) {
      throw new Error("Owner noot found");
    }

    const installationId = await getInstallationId(owner, repo);
    if (!installationId) {
      throw new Error("Installation id not found.");
    }

    const octokit = await getOctokit(installationId);
    if (!octokit) {
      throw new Error("Octokit not found.");
    }

    const payload = {
      owner,
      repo,
      pr_number: pr,
      comment,
    };

    let labelObject = {};
    if (label == 1) {
      labelObject = {
        label: "Choreo/BuildSuccess",
        color: "0E8A16",
      };
    } else {
      labelObject = {
        label: "Choreo/BuildFailure",
        color: "B60205",
      };
    }

    const isLabelAvailable = await getLabels(octokit, owner, repo, pr,labelObject);

    isLabelAvailable && addLabel(octokit, owner, repo, pr, labelObject);

    handleAddComment(octokit, payload);
  } catch (error) {
    logger.error({
      message: `Error in adding comment : ${
        error?.response?.data?.message || error?.message
      }`,
    });
  }
}

async function getInstallationId(owner, repo) {
  try {
    const jwtToken = generateJWT();
    if (!jwtToken) {
      throw new Error("JWT token not found.");
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
    logger.error({
      message: `Error in fetching installation id : ${
        error?.response?.data?.message || error?.message
      }`,
    });
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
    if (!octokit) {
      throw new Error("Octokit not found.");
    }
    return octokit;
  } catch (error) {
    logger.error({
      message: `Error in getting octokit : ${
        error?.response?.data?.message || error?.message
      }`,
    });
  }
}

async function getLabels(octokit, owner, repo,pr, labelObject) {
  if (!octokit) {
    throw new Error("Octokit not found.");
  }

  try {
    const labelsResponse = await octokit.request(
      "GET /repos/{owner}/{repo}/labels",
      {
        owner: owner,
        repo: repo,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const label = labelsResponse?.data?.find(
      (label) => label.name === labelObject.label
    );
    
    if (!label) {
      createLabel(octokit, owner, repo,pr, labelObject);
      return false;
    }
    return true;
  } catch (error) {
    logger.error({
      message: `Error in getting labels : ${
        error?.response?.data?.message || error?.message
      }`,
    });
  }
}

async function createLabel(octokit, owner, repo,pr, labelObject) {
  if (!octokit) {
    throw new Error("Octokit not found.");
  }

  try {
    const labelsResponse = await octokit.request(
      "POST /repos/{owner}/{repo}/labels",
      {
        owner: owner,
        repo: repo,
        name: labelObject.label,
        description: labelObject.label,
        color: labelObject.color,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    logger.info(`Label created successfully`);

    addLabel(octokit, owner, repo, pr, labelObject);
  } catch (error) {
    console.log("error", error);
    logger.error({
      message: `Error in adding label : ${
        error?.response?.data?.message || error?.message
      }`,
    });
  }
}

async function addLabel(octokit, owner, repo, pr, labelObject) {
  if (!octokit) {
    throw new Error("Octokit not found.");
  }

  try {
    const labelsResponse = await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/labels",
      {
        owner: owner,
        repo: repo,
        issue_number: pr,
        labels: [labelObject.label],
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    logger.info(`Label added successfully`);
  } catch (error) {
    logger.error({
      message: `Error in adding label : ${
        error?.response?.data?.message || error?.message
      }`,
    });
  }
}

async function handleAddComment(octokit, payload) {
  if (!octokit) {
    throw new Error("Octokit not found.");
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

    logger.info(
      `Comment added successfully\nView the comment at:\n${commentsResponse?.data?.html_url}`
    );
  } catch (error) {
    logger.error({
      message: `Error in adding comment : ${
        error?.response?.data?.message || error?.message
      }`,
    });
  }
}

export { addComment };
