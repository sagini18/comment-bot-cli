import { Octokit } from "@octokit/rest";
import axios from "axios";
import { readTokenFromFile } from "./install.js";

export const mergePullRequest = () => {
  const token = readTokenFromFile();
  axios
    .get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
      },
    })
    .then(async (response) => {
      const owner = response.data?.login;
      const octokit = new Octokit({
        auth: token,
      });
      await octokit
        ?.request("PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge", {
          owner: owner,
          repo: process?.argv?.[3],
          pull_number: process?.argv?.[4],
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        })
        .then((response) => {
          console.log("Pull Request merged successfully");
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            console.log("Invalid token. Please install the bot again.");
          }
          console.log(error.response?.data?.message);
        });
    });
};
