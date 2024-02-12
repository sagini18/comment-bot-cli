import axios from "axios";
import { readTokenFromFile } from "../utils/handleToken.js";

async function listOfRepositories() {
  const token = readTokenFromFile();
  if (!token) {
    console.log("Token not found. Please install the bot first.");
    return;
  }

  try {
    const repoResponse = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    repoResponse.data.forEach((element) => {
      console.log(element.name);
    });
  } catch (error) {
    console.log(
      "Error in fetching repositories: ",
      error?.response?.data?.message || error?.message
    );
  }
}

export { listOfRepositories };
