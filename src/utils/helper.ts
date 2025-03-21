interface Column {
  key: string;
  name: string;
}

interface TableData {
  columns: Column[];
  data: any[][];
}

export function transformTableDataToObjects<T = Record<string, any>>(tableData: TableData): T[] {
  const { columns, data } = tableData;
  
  return data.map(row => {
    const obj = {} as T;
    
    columns.forEach((column, index) => {
      (obj as any)[column.key] = row[index];
    });
    
    return obj;
  });
}