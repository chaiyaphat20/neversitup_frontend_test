export interface Todo {
  isSuccess: boolean;
  data:      TodoData[];
}

export interface TodoData {
  description:  string;
  title:        string;
  updated_at:   string;
  complete?:    boolean;
  created_at?:  string;
  created_by?:  CreatedBy;
  editStatus?:  boolean;
  popupStatus?: boolean;
  id?:          string;
}

export interface CreatedBy {
  id:       string;
  username: string;
}
