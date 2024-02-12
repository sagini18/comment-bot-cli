import jwt from "jsonwebtoken";
import fs from "fs";

export function generateJWT() {
  try {
    const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, "utf8");

    const appId = process.env.APP_ID;
    const payload = {
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60,
      iss: appId,
    };

    const jwtToken = jwt.sign(payload, privateKey, { algorithm: "RS256" });
    return jwtToken;
  } catch (err) {
    console.log("Error in generating jwt: ", err.message);
    return;
  }
}
