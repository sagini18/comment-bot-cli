import { readTokenFromFile } from "./install.js";
import axios from "axios";

async function listOfRepositories() {
  const token = readTokenFromFile();
  if (!token) {
    console.log("Token not found. Please install the bot first.");
    return;
  }

  const repoResponse = await axios.get("https://api.github.com/user/repos", {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  repoResponse.data.forEach((element) => {
    console.log(element.name);
  });

  if (repoResponse.status === 401) {
    console.log("Invalid token. Please install the bot again.");
    return;
  }
}

export { listOfRepositories };
