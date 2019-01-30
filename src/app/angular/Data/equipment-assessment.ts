import { EquipmentAssessmentRow } from './equipment-assessment-row';
import { EquipmentObservation } from './equipment-observation';

export class EquipmentAssessment {
    registered: Date;

    uniqueId: string;

    name: string;

    description: string;

    equipmentId: string;
    equipmentType: string;
    equipmentName: string;

    rows: EquipmentAssessmentRow[];

    userText: string;

    userName: string;

    systemStage: string;
}
