import { Part } from './part';

export class PartInstance {
    uniqueId: string;
    name: string;
    description: string;

    part: Part;

    registered: Date;
}
