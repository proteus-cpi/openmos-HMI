export class Recommendation {
    uniqueId: string;
    message: string;
    processed: boolean;
    discarded : boolean;
    subSystemId : string;
    subSystemName : string;
    isInRampup: boolean = false;
    nextActionType: string;
    registered: Date;
}
