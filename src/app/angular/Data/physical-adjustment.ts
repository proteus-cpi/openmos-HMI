import { PhysicalAdjustmentParameterSetting } from "./physical-adjustment-parameter-setting";

export class PhysicalAdjustment {
    registered: Date;

    uniqueId: string;

    name: string;

    description: string;

    equipmentId: string;
    equipmentType: string;
    equipmentName: string;

    // rows: EquipmentAssessmentRow[];
    physicalAdjustmentType: string;
    physicalAdjustmentParameterSetting: PhysicalAdjustmentParameterSetting

    userText: string;

    userName: string;

    systemStage: string;
}
