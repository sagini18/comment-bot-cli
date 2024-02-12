import axios from "axios";
import { logger } from "./logError.js";
import { readTokenFromFile } from "./handleToken.js";

export async function getOwner(){
    const token = readTokenFromFile();
    if (!token) {
      throw new Error("Token not found. Please install the bot first.");
    }
  
    try {
      const userData = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `token ${token}`,
        },
      });
  
      const owner = userData.data?.login;
      return owner;
    } catch (error) {
      logger.error({message:`Error in fetching user data : ${error?.response?.data?.message}`});
    }
};