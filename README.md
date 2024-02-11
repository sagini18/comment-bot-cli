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

Options:
  -h, --help            display help for command

Commands:
  install               Install the bot
  listofrepo            List all the repositories in the current organization.
  listofpr <repo>       List all the pull requests in the current repository.
  addcomment [options]  Add a comment to a pull request.
  addpr [options]       Add a pull request to a repository
  closepr [options]     Close a pull request.
  mergepr [options]     Merge a pull request.
  reopenpr [options]    Reopen a pull request.
  help [command]        display help for command

## Examples

```bash
# Install the GitHub app on selected repositories
prc install

# List repositories accessible to the bot
prc listofrepo 

# List pull requests in a specified repository
prc listofpr repo-name

# Add a comment to a pull request
prc addcomment -r repo-name -p pr-number -c "comment contents"

# Add a pull request to a specified repository
prc addpr -r repo-name -t "pull request title" -bo "pull request body" -he "head branch" -ba "base branch"

# Close a pull request on a specified repository
prc closepr -r repo-name -p pr-number

# Reopen a pull request on a specified repository
prc reopenpr -r repo-name -p pr-number

# Merge a pull request on a specified repository
prc mergepr -r repo-name -p pr-number
```


## Contact

- Author: Sagini Navaratnam
- Email: navaratnamsagini@email.com
