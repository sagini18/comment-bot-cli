#!/usr/bin/env node
import { program } from "commander";
import { Octokit } from "@octokit/rest";
import open from "open";
import axios from "axios";

// CLI command to open the login URL
program
  .command("install")
  .alias("i")
  .description("Open the link to install the bot")
  .action(() => {
    const installURL =
      "https://github.com/login/oauth/authorize?client_id=Iv1.aa3cb26d1819b071&redirect_uri=http://localhost:5000/github-app/callback&scope=repo"; // Replace with your installation URL
    open(installURL);
    console.log(`Opening ${installURL} in your default web browser.`);
  });

// CLI command to list all repositories
program
  .command("listOfRepositories")
  .alias("lr")
  .description("List all the repositories in the current organization.")
  .action(() => {
    axios
      .get("http://localhost:5000/repositories/all")
      .then((response) => {
        response?.data?.forEach((repo) => {
          console.log(repo);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  });

// CLI command to list all the pull requests
program
  .command("listOfPullRequest <repo>")
  .alias("lpr")
  .description("List all the pull requests in the current repository.")
  .action(async (repo) => {
    axios
      .get(`http://localhost:5000/pull-request/all?repo=${repo}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  // CLI command to add comment to a pull request
program
  .command("addComment <repo> <pr> <comment>")
  .alias("ac")
  .description("Add a comment to a pull request.")
  .action(async (repo, pr, comment) => {
    axios
      .post(`http://localhost:5000/pull-request/comment`, {repo, pr, comment})
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

program.parse(process.argv);
