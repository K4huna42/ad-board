export interface Category {
  id: string;
  name: string;
  parentId: string;
  childs?: Category[];
  expanded?: boolean;
  hasChildren?: boolean;
}
