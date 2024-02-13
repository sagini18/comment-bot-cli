import axios from "axios";
import express from "express";
import open from "open";
import { saveTokenToFile } from "../utils/handleToken.js";
import { logger } from "../utils/logError.js";

const app = express();
let serverInstance;

function install() {
  try {
    createServer();
    const installURL = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&scope=${process.env.SCOPE}`;
    open(installURL);
    logger.info(`Opening ${installURL} in your default web browser.`);
    authorization();
  } catch (err) {
    logger.error({ message: err?.message });
  }
}

async function createServer() {
  const port = await getRandomPort();
  serverInstance = app.listen(port);
  logger.info(`Server is running on port ${port}`);
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
  try {
    app.get("/github-app/callback", async (req, res) => {
      const code = req?.query?.code;
      if (!code) {
        throw new Error("Code not found");
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
      if (!oauthResponse) {
        throw new Error("Something went wrong in fetching the token.");
      }

      if (oauthResponse.data?.access_token) {
        saveTokenToFile(oauthResponse.data.access_token);
        res.redirect(process.env.AFTER_AUTHORIZED_REDIRECT_URL);
        serverInstance.close();
        logger.info("server stopped");
      } else {
        throw new Error("Token not found");
      }
    });
  } catch (err) {
    logger.error({ message: err?.message });
  }
}

export { install };
