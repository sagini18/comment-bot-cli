import { readTokenFromFile } from "./install.js";
import axios from "axios";

const listOfRepositories = () => {
  const token = readTokenFromFile();
  axios
    .get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `token ${token}`,
      },
    })
    .then((response) => {
      response.data.forEach((element) => {
        console.log(element.name);
      });
    })
    .catch((error) => {
      if (error.response?.status === 401) {
        console.log("Invalid token. Please install the bot again.");
      } else {
        console.log(error.response?.data?.message);
      }
    });
};

export { listOfRepositories };
