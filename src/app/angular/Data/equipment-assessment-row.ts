export class EquipmentAssessmentRow {
    registered: Date;

    uniqueId: string;

    equipmentAssessmentId: string;

    // Refactoring from type to earType (equipment assessment row type)
    earType: string;

    rating: number;

    constructor(id: string, assessmentId: string, type: string) {
        this.registered = new Date();
        this.uniqueId = id;
        this.equipmentAssessmentId = assessmentId;
        this.earType = type;
        this.rating = 0;
    }
}
