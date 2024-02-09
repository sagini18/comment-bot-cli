## prcommentorcli
prcommentorcli is a command-line interface (CLI) tool that facilitates self-service end-to-end operations for managing GitHub pull requests. With this tool, users can seamlessly install a GitHub app (or "bot") on selected repositories, list repositories accessible to the bot, list, add, reopen, merge and close the pull requests within a specified repository, and add comments to specific pull requests.


## Features
- Install GitHub App: Easily install the GitHub app ("bot") on selected repositories.
- List Repositories: View a list of repositories accessible to the bot within the current organization.
- List Pull Requests: Retrieve a list of pull requests within a specified repository.
- Add Comments: Add comments to specific pull requests in a given repository.
- Add Pull Requests: Add pull requests to a specified repository.
- Close Pull Requests: Close pull requests on a specified repository.
- Reopen Pull Requests: Reopen pull requests on a specified repository.
- Merge Pull Requests: Merge pull requests on a specified repository.

## Installation
To install prcommentorcli, use npm:

```bash
npm install -g prcommentorcli
```

## Usage

After installation, you can use the CLI with the following options:


prcommentorcli [options]

Options:

- -i, --install                                               Install the bot
- -lr, --listOfRepositories                                   List all the repositories in the current organization.
- -lpr, --listOfPullRequest <repo>                            List all the pull requests in the current repository.
- -ac, --addComment <repo> <pr> <comment>                     Add a comment to a pull request.
- -apr, --addPullRequest <repo> <title> <body> <head> <base>  Add a pull request.
- -cpr, --closePullRequest <repo> <pr>                        Close a pull request.
- -mpr, --mergePullRequest <repo> <pr>                        Merge a pull request.
- -rpr,-reopenPullRequest <repo> <pr>                         Reopen a pull request.
- -h, --help                                                  display help for command

## Examples

```bash
# Install the GitHub app on selected repositories
prc -i

# List repositories accessible to the bot
prc -lr

# List pull requests in a specified repository
prc -lpr repo-name

# Add a comment to a pull request
prc -ac repo-name pr-number "comment contents"

# Add a pull request to a specified repository
prc -apr repo-name "pull request title" "pull request body" "head branch" "base branch"

# Close a pull request on a specified repository
prc -cpr repo-name pr-number

# Reopen a pull request on a specified repository
prc -rpr repo-name pr-number

# Merge a pull request on a specified repository
prc -mpr repo-name pr-number
```


## Contact

- Author: Sagini Navaratnam
- Email: navaratnamsagini@email.com
