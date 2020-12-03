module fileBrowser {

    export const rootImg: string = <any>$ts("@img:root");
    export const folderImg: string = <any>$ts("@img:folder");
    export const fileImg: string = <any>$ts("@img:file");

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

        let root = node(fileIndex.label, rootImg);

        for (let name in summary) {
            let childs: string[] = summary[name];
            let ms2 = $from(childs).Select(label => node(label, fileImg)).ToArray();
            let childTree = node(name, folderImg);

            childTree.children = ms2;

            root.children.push(childTree);
        }

        return root;
    }
}