export interface Comment {
  id: string;
  text: string;
  created: string;
  parentId: string | null;
  user: {
    id: string;
    name: string;
    login: string;
  };
}
