import { Guid } from 'src/app/lib/misc/guid';

export class GraphElement {
    public DataContext: any;
    public Id: string;

    constructor() {
        this.Id = Guid.guid();
    }
}
