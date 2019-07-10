module fileBrowser {

    export function createTree(display: string, indexTree: fileIndexTree, viewer: BioDeep.RawFileViewer) {
        let jsTree = buildjsTree(indexTree, new uid());

        $(display).jstree({
            "core": {
                "animation": 0,
                "check_callback": true,
                "themes": { "stripes": true },
                'data': jsTree
            }
        });
        $(display).on('changed.jstree', function (e, data) {
            var path: string = data.instance.get_path(data.node, '/');

            console.log('Selected: ' + path);
            viewer.draw("#TIC", path.replace("//", "/"));
        });

        console.log(indexTree);
        console.log(jsTree);
    }

    function buildjsTree(fileIndex: fileIndexTree, uid: uid): jsTreeModel {
        let root = <jsTreeModel>{
            id: uid.nextGuid,
            text: fileIndex.Label,
            children: []
        }

        for (var name in fileIndex.Childs) {
            var childIndex: fileIndexTree = fileIndex.Childs[name];
            var childTree = buildjsTree(childIndex, uid);

            root.children.push(childTree);
        }

        return root;
    }

    class uid {

        private guid: number = 0;

        get nextGuid(): number {
            return ++this.guid;
        }
    }

    interface jsTreeModel {
        id: number;
        text: string;
        children: jsTreeModel[];
    }

    export interface fileIndexTree {
        ID: number;
        Label: string;
        Childs: {};
    }
}