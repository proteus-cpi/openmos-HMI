export class EquipmentObservationRow {
    registered: Date;

    uniqueId: string;

    equipmentObservationId: string;

    // Refactoring from type to eorType (equipment observation row type)
    eorType: string;

    subtype: string;

    unit: string;

    value: number;

    constructor(id: string, observationId: string, type: string, subType: string, unit: string, value: number) {
        this.registered = new Date();
        this.uniqueId = id;
        this.equipmentObservationId = observationId;
        this.eorType = type;
        this.subtype = subType;
        this.unit = unit;
        this.value = value;
    }
}
