import * as alt from "@altv/client";
import * as natives from "@altv/natives";
import Utils from "./utils";
import MouseController from "./mouse";
import { screenToWorld } from "./screen-to-world";

type Vertexes = [
  alt.IVector3,
  alt.IVector3,
  alt.IVector3,
  alt.IVector3,
  alt.IVector3,
  alt.IVector3,
  alt.IVector3,
  alt.IVector3
];

interface ObjectInfo {
  id: number;
  model: number;
  vertexes: Vertexes | undefined;
  coord: alt.IVector3;
  rot: alt.IVector3;
  coordHit: alt.IVector3;
  textureVariation: number;
}

export default class ModelInspectorController {
  static readonly instance = new ModelInspectorController();

  private constructor() {
    alt.Timers.everyTick(this.onEveryTick);
    alt.Timers.setInterval(this.cast, 50);
    alt.Events.onKeyDown(this.onKeyDown);
  }

  private _state: boolean = false;
  private _currentObject?: ObjectInfo;

  onKeyDown = ({ key }: alt.Events.KeyUpDownEventParameters) => {
    if (key === 114) {
      this._state = !this._state;
    } else if (this._state && key === 69) {
      const str = this.getString();
      if (str) alt.log(str);
    }
  };

  getString() {
    if (!this._currentObject) return null;
    const obj = this._currentObject;
    const entity = alt.Entity.getByScriptID(+obj.id);

    let str =
      `ScriptID: ${obj.id}~n~` +
      `Model: ${obj.model}~n~` +
      `Texture: ${obj.textureVariation}~n~` +
      `Coord: ${obj.coord.x.toFixed(3)} ${obj.coord.y.toFixed(3)} ${obj.coord.z.toFixed(3)}~n~` +
      `Rot: ${obj.rot.x.toFixed(3)} ${obj.rot.y.toFixed(3)} ${obj.rot.z.toFixed(3)}~n~`;
    if (entity) str += `Entity: ${entity.constructor.name}~n~Entity ID: ${entity.id}~n~`;

    return str;
  }

  onEveryTick = () => {
    if (!this._state) return;

    const [x, y] = natives.getActualScreenResolution();
    const height = 3 / x;
    const width = (height * y) / x;
    natives.drawRect(0.5, 0.5, width, height, 255, 255, 255, 255, true);

    if (!this._currentObject) {
      natives.beginTextCommandDisplayHelp("STRING");
      natives.addTextComponentSubstringPlayerName(
        `Use the crosshair or mouse pointer (F2) to select the target object`
      );
      natives.endTextCommandDisplayHelp(0, false, false, 0);
      return;
    }

    const obj = this._currentObject;
    if (obj.vertexes) {
      Utils.drawBoxWithLines(...obj.vertexes, 255, 255, 255, 255);
      Utils.drawBoxWithPolygons(...obj.vertexes, 255, 0, 0, 128);
    }
    alt.Gxt.add("modelHelp", this.getString()!);
    natives.beginTextCommandDisplayHelp("STRING");
    natives.addTextComponentSubstringTextLabel("modelHelp");
    natives.endTextCommandDisplayHelp(0, false, false, 0);
  };

  cast = () => {
    const start = natives.getGameplayCamCoord();
    const end = MouseController.instance.state
      ? screenToWorld()
      : start.add(Utils.rotationToForward(natives.getGameplayCamRot(2)).mul(300));

    const raycast = natives.startExpensiveSynchronousShapeTestLosProbe(
      start.x,
      start.y,
      start.z,
      end.x,
      end.y,
      end.z,
      511,
      alt.Player.local.scriptID,
      4
    );
    const [, hit, endCoords, , entityHit] = natives.getShapeTestResult(raycast);

    if (!hit) return (this._currentObject = undefined);
    const hasDrawable = natives.doesEntityHaveDrawable(entityHit);
    const model = hasDrawable ? natives.getEntityModel(entityHit) : -1;

    let vertexes: Vertexes | undefined = undefined;
    if (hasDrawable) {
      const [minVR, maxVR] = natives.getModelDimensions(model);

      if (!maxVR || Number.isNaN(maxVR.x) || Number.isNaN(maxVR.y) || Number.isNaN(maxVR.z))
        return (this._currentObject = undefined);

      // prevents clipping
      const [minV, maxV] = [
        new alt.Vector3(-0.001, -0.001, -0.001).add(minVR as any as alt.Vector3),
        new alt.Vector3(0.001, 0.001, 0.001).add(maxVR),
      ];
      vertexes = [
        natives.getOffsetFromEntityInWorldCoords(entityHit, minV.x, minV.y, maxV.z),
        natives.getOffsetFromEntityInWorldCoords(entityHit, minV.x, maxV.y, maxV.z),
        natives.getOffsetFromEntityInWorldCoords(entityHit, maxV.x, minV.y, maxV.z),
        natives.getOffsetFromEntityInWorldCoords(entityHit, maxV.x, maxV.y, maxV.z),
        natives.getOffsetFromEntityInWorldCoords(entityHit, minV.x, minV.y, minV.z),
        natives.getOffsetFromEntityInWorldCoords(entityHit, minV.x, maxV.y, minV.z),
        natives.getOffsetFromEntityInWorldCoords(entityHit, maxV.x, maxV.y, minV.z),
        natives.getOffsetFromEntityInWorldCoords(entityHit, maxV.x, minV.y, minV.z),
      ];
    }

    this._currentObject = {
      // @ts-expect-error
      id: typeof entityHit === "number" ? entityHit : entityHit.scriptID,
      model,
      coord: hasDrawable
        ? natives.getEntityCoords(entityHit, !natives.isEntityDead(entityHit, false))
        : endCoords,
      rot: natives.getEntityRotation(entityHit, 2),
      coordHit: endCoords,
      textureVariation: natives.getObjectTintIndex(entityHit),
      vertexes,
    };
  };
}
