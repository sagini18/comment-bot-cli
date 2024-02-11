import { Octokit } from "@octokit/rest";
import axios from "axios";
import { readTokenFromFile } from "./install.js";

export const addComment = (repo,pr, comment) => {
  console.log("Adding comment to the pull request:");
  console.log(pr);
  console.log("Comment:");
  console.log(comment);
  console.log(repo);
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
        ?.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
          owner: owner,
          repo: repo,
          issue_number: pr,
          body: comment,
        })
        .then((response) => {
          console.log("Comment added successfully");
          console.log("View the comment at:")
          console.log(response.data?.html_url);
        })
        .catch((error) => {
           if (error.response?.status === 401) {
            console.log("Invalid token. Please install the bot again.");
          }
          console.log(error.response?.data?.message);
        });
    })
    .catch((error) => {
      console.log(error.response?.data?.message);
    });
};
