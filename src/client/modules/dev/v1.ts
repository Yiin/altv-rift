// @ts-ignore
import alt from "alt-client";

alt.on('consoleCommand', (cmd: string) => {
  if (cmd === "car") {
    const veh = new alt.LocalVehicle("adder", 0, alt.Player.local.pos.add(2, 0, 0), alt.Vector3.zero);

    console.log(veh instanceof alt.LocalVehicle, veh instanceof alt.Vehicle);
  }

  if (cmd === "player") {
    console.log(alt.Player.local instanceof alt.LocalPlayer, alt.Player.local instanceof alt.Player);
  }
});
