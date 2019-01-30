import { ProcessAssessmentRow } from './process-assessment-row';
// import { EquipmentObservation } from './equipment-observation';

export class ProcessAssessment {
    registered: Date;

    uniqueId: string;

    name: string;

    description: string;

    equipmentId: string;
    equipmentType: string;
    equipmentName: string;

    recipeId: string;
    recipeName : string;
    // equipmentType: string;

    skillId: string;
    skillName : string;
    
    rows: ProcessAssessmentRow[];

    userText: string;
    userName: string;
    systemStage: string;
}
