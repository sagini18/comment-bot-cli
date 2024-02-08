#!/usr/bin/env node
import { program } from "commander";
import express from "express";
import { install } from "./utils/install.js";
import { listOfRepositories } from "./utils/listOfRepositories.js";
import { listOfPullRequest } from "./utils/listOfPullRequest.js";
import { addComment } from "./utils/addComment.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

program
  .option("-i, --install", "Install the bot", install)
  .option(
    "-lr, --listOfRepositories",
    "List all the repositories in the current organization.",
    listOfRepositories
  )
  .option(
    "-lpr, --listOfPullRequest <repo>",
    "List all the pull requests in the current repository.",
    listOfPullRequest
  )
  .option(
    "-ac, --addComment <repo> <pr> <comment>",
    "Add a comment to a pull request.",
    (repo, pr, comment) => addComment(repo, pr, comment)
  )
  .parse();
