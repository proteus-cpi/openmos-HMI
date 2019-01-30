export class ProcessAssessmentRow {
    registered: Date;

    uniqueId: string;

    processAssessmentId: string;

    // Refactoring from type to parType (process assessment row type)
    parType: string;

    rating: number;

    constructor(id: string, assessmentId: string, type: string) {
        this.registered = new Date();
        this.uniqueId = id;
        this.processAssessmentId = assessmentId;
        this.parType = type;
        this.rating = 0;
    }
}
