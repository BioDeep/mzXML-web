namespace components {

    export class uid {

        private guid: number = 0;

        get nextGuid(): number {
            return ++this.guid;
        }
    }

    export interface jsTreeModel {
        id: number;
        text: string;
        children: jsTreeModel[];
        icon: string;
    }

    export interface fileIndexTree {
        ID: number;
        Label: string;
        Childs: {};
    }
}