module fileBrowser {

    export function buildjsTree(fileIndex: BioDeep.IO.MzWebCache.Stream, uid: components.uid): components.jsTreeModel {
        let summary = fileIndex.getSummary();
        let node = function (label: string, icon: string) {
            return <components.jsTreeModel>{
                id: uid.nextGuid,
                text: label,
                children: [],
                icon: icon
            }
        }

        let root = node(fileIndex.label, "dist/images/gparted.png");

        for (let name in summary) {
            let childs: string[] = summary[name];
            let ms2 = $from(childs).Select(label => node(label, "dist/images/application-x-object.png")).ToArray();
            let childTree = node(name, "dist/images/folder-documents.png");

            childTree.children = ms2;

            root.children.push(childTree);
        }

        return root;
    }
}