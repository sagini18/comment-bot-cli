#!/usr/bin/env node
import { program } from "commander";
import express from "express";
import { install } from "./utils/install.js";
import { listOfRepositories } from "./utils/listOfRepositories.js";
import { listOfPullRequest } from "./utils/listOfPullRequest.js";
import { addComment } from "./utils/addComment.js";
import { addPullRequest } from "./utils/addPullRequest.js";
import { closePullRequest } from "./utils/closePullRequest.js";
import { mergePullRequest } from "./utils/mergePullRequest.js";
import { reopenPullRequest } from "./utils/reopenPullRequest.js";
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
    addComment
  )
  .option(
    "-apr, --addPullRequest <repo> <title> <body> <head> <base>",
    "Add a pull request.",
    addPullRequest
  )
  .option(
    "-cpr, --closePullRequest <repo> <pr>",
    "Close a pull request.",
    closePullRequest
  )
  .option(
    "-mpr, --mergePullRequest <repo> <pr>",
    "Merge a pull request.",
    mergePullRequest
  )
  .option(
    "-rpr,-reopenPullRequest <repo> <pr>",
    "Reopen a pull request.",
    reopenPullRequest
  )
  .parse();
