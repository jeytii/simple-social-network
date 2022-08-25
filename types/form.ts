export interface Variables<K, V = string> {
  url: string;
  data: {
    [key in K as string]: V;
  };
}

export interface ErrorData<K> {
  message: string;
  errors: {
    [key in K as string]: string[];
  };
}
