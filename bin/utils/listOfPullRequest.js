import { Octokit } from "@octokit/rest";
import axios from "axios";
import { readTokenFromFile } from "./install.js";

const listOfPullRequest = async (repo) => {
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
        ?.request("GET /repos/{owner}/{repo}/pulls", {
          owner: owner,
          repo: repo,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        })
        .then((response) => {
          if (response?.data?.length === 0) {
            console.log("No pull requests found");
          } else {
            var pullRequestData = [];
            response.data?.forEach((element) => {
              pullRequestData.push({
                title: element.title,
                number: element.number,
                body: element.body,
              });
            });
            console.table(pullRequestData);
          }
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            console.log("Invalid token. Please install the bot again.");
          } else {
            console.log(error.response?.data?.message);
          }
        });
    })
    .catch((error) => {
      if (error.response?.status === 401) {
        console.log("Invalid token. Please install the bot again.");
      } else {
        console.log(error.response?.data?.message);
      }
    });
};

export { listOfPullRequest };
