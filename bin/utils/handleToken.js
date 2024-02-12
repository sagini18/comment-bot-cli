import fs from "fs";

function saveTokenToFile(token) {
  fs.writeFileSync("token.txt", token, "utf-8");
}
function readTokenFromFile() {
  return fs.readFileSync("token.txt", "utf-8");
}

export { saveTokenToFile, readTokenFromFile };