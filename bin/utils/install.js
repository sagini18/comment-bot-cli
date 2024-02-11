import axios from "axios";
import express from "express";
import open from "open";
import fs from "fs";

const app = express();
let serverInstance;

function install() {
  createServer();
  const installURL = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&scope=${process.env.SCOPE}`;
  open(installURL);
  console.log(`Opening ${installURL} in your default web browser.`);
  authorization();
}

async function createServer() {
  const port = await getRandomPort();
  serverInstance = app.listen(port);
}

async function getRandomPort() {
  //if the port 5000 is using it should be incremented by 1
  let port = 5000;

  while (port) {
    const portTaken = await isPortTaken(port);
    if (portTaken) {
      port++;
    } else {
      return port;
    }
  }
}

async function isPortTaken(port) {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      server.close(() => {
        resolve(false); // Port is available
      });
    });

    server.on("error", (err) => {
      err.code === "EADDRINUSE" ? resolve(true) : resolve(false);
    });
  });
}

function authorization() {
  app.get("/github-app/callback", async (req, res) => {
    const code = req?.query?.code;
    if (!code) {
      console.log("Code not found");
      return;
    }

    const tokenURL = `https://github.com/login/oauth/access_token`;
    const oauthResponse = await axios.post(
      tokenURL,
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    if (oauthResponse.data?.access_token) {
      saveTokenToFile(oauthResponse.data.access_token);
      res.redirect(process.env.AFTER_AUTHORIZED_REDIRECT_URL);
      serverInstance.close();
    } else {
      console.log("Token not found");
      return;
    }
  });
}
function saveTokenToFile(token) {
  fs.writeFileSync("token.txt", token, "utf-8");
}
function readTokenFromFile() {
  return fs.readFileSync("token.txt", "utf-8");
}

export { install, readTokenFromFile };
