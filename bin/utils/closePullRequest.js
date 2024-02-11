import { Octokit } from "@octokit/rest";
import axios from "axios";
import { readTokenFromFile } from "./install.js";

export const closePullRequest = (repo,pr) => {
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
            ?.request("PATCH /repos/{owner}/{repo}/pulls/{pull_number}", {
            owner,
            repo,
            pull_number: pr,
            state: "closed",
            })
            .then((response) => {
            console.log("Pull Request closed successfully");
            console.log("View the pull request at:");
            console.log(response.data?.html_url);
            })
            .catch((error) => {
            if (error.response?.status === 401) {
                console.log("Invalid token. Please install the bot again.");
            }
            console.log(error.response?.data?.message);
            });
        });
}
