import { EquipmentObservationRow } from './equipment-observation-row';

export class EquipmentObservation {
    registered: Date;

    uniqueId: string;

    name: string;

    description: string;

    equipmentId: string;
    equipmentType: string;
    equipmentName : string;

    rows: EquipmentObservationRow[];

    userText: string;
    userName: string;
    systemStage: string;
}
