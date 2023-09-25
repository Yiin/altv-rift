import path from "path";
import * as alt from "@altv/server";
import axios from "axios";
import express, { Request, Response } from "express";
import cors from "cors";
import { ClientEvents } from "@shared/events/client";
import { ServerEvents } from "@shared/events/server";

const htmlPath = path.join(__dirname, "html");
const stylesPath = path.join(__dirname, "html/styles");
const app = express();

app.use(cors());
app.get("/authenticate", handleMainRedirect);
app.use("/styles", express.static(stylesPath));

async function handleMainRedirect(req: Request, res: Response) {
  const token = req.query.code as string | undefined;
  const userToken = req.query.state;
  let request;

  if (!token || !userToken) {
    res.sendFile(path.join(htmlPath, "/error.html"), (err) => {});
    return;
  }

  const authParams = new URLSearchParams();
  authParams.append(`client_id`, process.env["DISCORD_CLIENT_ID"]!);
  authParams.append(`client_secret`, process.env["DISCORD_CLIENT_SECRET"]!);
  authParams.append(`grant_type`, `authorization_code`);
  authParams.append(`code`, token);
  authParams.append(`scope`, `identify`);
  authParams.append(`redirect_uri`, `http://${process.env["REDIRECT_IP"]}:7790/authenticate`);

  request = await axios.post(`https://discordapp.com/api/oauth2/token`, authParams, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (!request.data || !request.data.access_token) {
    res.sendFile(path.join(htmlPath, "/error.html"), (err) => {});
    return;
  }

  // id, username, avatar, discriminator, public_flags, flags, locale, mfa_enabled
  const player = [...alt.Player.all].find((player) => player.syncedMeta.discordToken === userToken);

  if (!player || !player.valid) {
    res.sendFile(path.join(htmlPath, "/error.html"), (err) => {});
    return;
  }

  alt.Events.emit(
    ServerEvents.FromServer.MANUAL_DISCORD_AUTH_DONE,
    player,
    request.data.access_token
  );
  player.emitRaw(ClientEvents.FromServer.REMEMBER_AUTH_TOKEN, request.data.access_token);
  res.sendFile(path.join(htmlPath, "/done.html"), (err) => {});
}

app.listen(7790);
