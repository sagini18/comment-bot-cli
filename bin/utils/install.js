import axios from "axios";
import express from "express";
import open from "open";
import fs from "fs";
// import dotenv from "dotenv";
const app = express();
let token;
let serverInstance;

const install = () => {
  serverInstance = app.listen(5000);
  const installURL =
    "https://github.com/login/oauth/authorize?client_id=Iv1.aa3cb26d1819b071&redirect_uri=http://localhost:5000/github-app/callback&scope=repo";
  open(installURL);
  console.log(`Opening ${installURL} in your default web browser.`);

  app.get("/github-app/callback", (req, res) => {
    const code = req?.query?.code;
    const tokenURL = `https://github.com/login/oauth/access_token?client_id=Iv1.aa3cb26d1819b071&client_secret=182996c6b2fd80a82b304bc6ca74881ea05c065a&code=${code}`;
    axios
      .post(tokenURL, null, {
        headers: {
          accept: "application/json",
        },
      })
      .then((response) => {
        token = response.data?.access_token;
        // dotenv.populate(process.env, { TOKEN: token }, { override: true });
        // console.log("Token added to .env file", process.env.TOKEN);
        saveTokenToFile(token);

        if (token === undefined) {
          console.log("Token not found");
        }
        res.redirect(
          "https://github.com/apps/pr-comment-on-build/installations/new"
        );
        if (serverInstance) {
          serverInstance.close();
        }
      })
      .catch((error) => {
        console.log(error.response?.data?.message);
      });
  });
};

// Function to save token to a file
function saveTokenToFile(token) {
  fs.writeFileSync("token.txt", token, "utf-8");
}
// Function to read token from file
function readTokenFromFile() {
  return fs.readFileSync("token.txt", "utf-8");
}

export { install, readTokenFromFile };
