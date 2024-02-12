import axios from "axios";
import { readTokenFromFile } from "../utils/handleToken.js";
import { getOwner } from "../utils/getOwner.js";

async function listOfRepositories() {
  try {
    const token = readTokenFromFile();
    if (!token) {
      throw new Error("Token not found. Please install the bot first.");
    }
    const username = await getOwner();
    if (!username) {
      throw new Error("Owner not found.");
    }

    const repoResponse = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      {
        headers: {
          Authorization: `token ${token}`,
        },
      }
    );
    repoResponse.data.forEach((element) => {
      console.log(element.name);
    });
  } catch (error) {
    console.log(
      "Error in fetching repositories: ",
      error?.message || error?.response?.data?.message
    );
  }
}

export { listOfRepositories };
