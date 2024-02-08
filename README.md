# Project Name

prcommentorcli

## Description

Build a CLI to allow user self-service e2e.

## Features

- Using the CLI to install the GH app (“bot”) on the selected repositories
- List out the repositories the bot has access to.
- Command to list pull requests on a specified repository
- Command to add a comment to a given PR in a given repository.

## Installation

npm i prcommentorcli

## Usage

Usage: index [options]

Options:
  -i, --install                            Install the bot
  -lr, --listOfRepositories                List all the repositories in the current organization.
  -lpr, --listOfPullRequest <repo>         List all the pull requests in the current repository.
  -ac, --addComment <repo> <pr> <comment>  Add a comment to a pull request.
  -h, --help                               display help for command

## Contact

- Author: Sagini Navaratnam
- Email: saginisaju@email.com
