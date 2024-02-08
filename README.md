## prcommentorcli
prcommentorcli is a command-line interface (CLI) tool that facilitates self-service end-to-end operations for managing GitHub pull requests. With this tool, users can seamlessly install a GitHub app (or "bot") on selected repositories, list repositories accessible to the bot, list pull requests within a specified repository, and add comments to specific pull requests.

## Features
- Install GitHub App: Easily install the GitHub app ("bot") on selected repositories.
- List Repositories: View a list of repositories accessible to the bot within the current organization.
- List Pull Requests: Retrieve a list of pull requests within a specified repository.
- Add Comments: Add comments to specific pull requests in a given repository.

## Installation
To install prcommentorcli, use npm:

```bash
npm install -g prcommentorcli
```

## Usage

After installation, you can use the CLI with the following options:


prcommentorcli [options]

Options:

- -i, --install: Install the GitHub app on selected repositories.
- -lr, --listOfRepositories: List all repositories accessible to the bot within the current organization.
- -lpr, --listOfPullRequest <repo>: List all pull requests within the specified repository.
- -ac, --addComment <repo> <pr> <comment>: Add a comment to a specific pull request.
- -h, --help: Display help for command.

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
```


## Contact

- Author: Sagini Navaratnam
- Email: saginisaju@email.com
