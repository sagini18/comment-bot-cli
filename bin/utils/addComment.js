import { Octokit } from "@octokit/rest";
import axios from "axios";
import { readTokenFromFile } from "./install.js";

export const addComment = () => {
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
          repo: process?.argv?.[3],
          issue_number: process?.argv?.[4],
          body: process?.argv?.[5],
        })
        .then((response) => {
          console.log("Comment added successfully");
          console.log("View the comment at:")
          console.log(response.data?.html_url);
        })
        .catch((error) => {
          console.log(error.response?.data?.message);
        });
    })
    .catch((error) => {
      console.log(error.response?.data?.message);
    });
};
