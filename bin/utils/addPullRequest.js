import { Octokit } from "@octokit/rest";
import axios from "axios";
import { readTokenFromFile } from "./install.js";

export const addPullRequest = (repo, title, body, head, base) => {
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
        ?.request("POST /repos/{owner}/{repo}/pulls", {
          owner,
          repo,
          title,
          body,
          head,
          base,
        })
        .then((response) => {
          console.log("Pull Request added successfully");
          console.log("View the pull request at:");
          console.log(response.data?.html_url);
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            console.log("Invalid token. Please install the bot again.");
          } else if (error.response?.status === 422) {
            console.log(error.response?.data?.errors[0]?.message);
          } else {
            console.log(error.response?.data?.message);
          }
        });
    });
};
