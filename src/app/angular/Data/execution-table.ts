import { ExecutionTableRow } from './execution-table-row';

export class ExecutionTable {
    uniqueId: string;
    name: string;
    description: string;
    rows: ExecutionTableRow[];
    registered: Date;

    constructor(et: ExecutionTable) {

        console.log("loaded execution table: " + JSON.stringify(et));

        this.uniqueId = et.uniqueId;
        this.name = et.name;
        this.rows = et.rows;
        this.registered = et.registered;

        this.rows = new Array<ExecutionTableRow>(et.rows.length);

        for (let i = 0; i < et.rows.length; i++) {
            this.rows[i] = new ExecutionTableRow(et.rows[i]);
        }
    }
}
