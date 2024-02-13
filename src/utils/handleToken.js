import fs from "fs";
import { logger } from "./logError.js";

function saveTokenToFile(token) {
  try{
  fs.writeFileSync("token.txt", token, "utf-8");
  }catch(err){
    logger.error({message:err.message});
  }
}
function readTokenFromFile() {
  try{
  return fs.readFileSync("token.txt", "utf-8");
  }catch(err){
    logger.error({message:err.message});
  }
}

export { saveTokenToFile, readTokenFromFile };