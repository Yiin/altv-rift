import alt from "alt-server";
import sjcl from "sjcl";

const ip = encodeURI(`http://${process.env["REDIRECT_IP"]}:7790/authenticate`);
const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env["DISCORD_CLIENT_ID"]}&redirect_uri=${ip}&prompt=none&response_type=code&scope=identify`;

export function getDiscordAuthUrl(player: alt.Player) {
  let hashBytes = sjcl.hash.sha256.hash(
    JSON.stringify(player.ip) + ~~(Math.random() * 900000000)
  );
  const playerToken = sjcl.codec.hex.fromBits(hashBytes);

  player.setSyncedMeta("discord:Token", playerToken);

  return `${url}&state=${playerToken}`;
}
