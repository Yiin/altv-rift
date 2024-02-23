// @ts-ignore
import alt from 'alt-server';

const _vehicle = new alt.Vehicle('adder', new alt.Vector3(0, 0, 73), new alt.Vector3(0, 0, 0));
alt.log('radio', _vehicle.activeRadioStation);
_vehicle.activeRadioStation = 1;
alt.log('radio2', _vehicle.activeRadioStation);
