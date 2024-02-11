#!/usr/bin/env node
import { program } from "commander";
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

program.command("install").description("Install the bot").action(install);

program
  .command("listofrepo")
  .description("List all the repositories in the current organization.")
  .action(listOfRepositories);

program
  .command("listofpr")
  .description("List all the pull requests in the current repository.")
  .argument("<repo>", "The repository to list the pull requests from.")
  .action((repo) => listOfPullRequest(repo));

program
  .command("addcomment")
  .description("Add a comment to a pull request.")
  .requiredOption("-r, --repo <repo>", "The repository to add the comment to.")
  .requiredOption("-p, --pr <pr>", "The pull request to add the comment to.")
  .requiredOption("-c, --comment <comment>", "The comment to be added.")
  .action(({repo, pr, comment}) => addComment(repo, pr, comment));

program
  .command("addpr")
  .description("Add a pull request to a repository")
  .requiredOption("-r, --repo <repo>", "The repository to add the pull request to.")
  .requiredOption("-t, --title <title>", "The title of the pull request.")
  .requiredOption("-bo, --body <body>", "The body of the pull request.")
  .requiredOption("-he, --head <head>", "The head of the pull request.")
  .requiredOption("-ba, --base <base>", "The base of the pull request.")
  .action(({repo, title, body, head, base}) => addPullRequest(repo, title, body, head, base));

program
  .command("closepr")
  .description("Close a pull request.")
  .requiredOption("-r, --repo <repo>", "The repository to close the pull request.")
  .requiredOption("-p, --pr <pr>", "The pull request to be closed.")
  .action(({repo,pr})=>closePullRequest(repo,pr));

program
  .command("mergepr")
  .description("Merge a pull request.")
  .requiredOption("-r, --repo <repo>", "The repository to merge the pull request.")
  .requiredOption("-p, --pr <pr>", "The pull request to be merged.")
  .action(({repo,pr})=>mergePullRequest(repo,pr));

program
  .command("reopenpr")
  .description("Reopen a pull request.")
  .requiredOption("-r, --repo <repo>", "The repository to reopen the pull request.")
  .requiredOption("-p, --pr <pr>", "The pull request to be reopened.")
  .action(({repo,pr})=>reopenPullRequest(repo,pr));

program.parse(process.argv);
