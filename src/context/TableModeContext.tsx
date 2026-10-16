import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type TableMode = "animated" | "text";
const KEY = "COUP_TABLE_MODE";

interface TableModeValue {
  tableMode: TableMode;
  isAnimated: boolean;
  setTableMode: (m: TableMode) => void;
}

const TableModeContext = createContext<TableModeValue>({
  tableMode: "animated",
  isAnimated: true,
  setTableMode: () => {},
});

function readInitial(): TableMode {
  try {
    return localStorage.getItem(KEY) === "text" ? "text" : "animated";
  } catch {
    return "animated";
  }
}

export const TableModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tableMode, setMode] = useState<TableMode>(readInitial);

  const setTableMode = useCallback((m: TableMode) => {
    setMode(m);
    try { localStorage.setItem(KEY, m); } catch {}
  }, []);

  const value = useMemo(
    () => ({ tableMode, isAnimated: tableMode === "animated", setTableMode }),
    [tableMode, setTableMode]
  );
  return <TableModeContext.Provider value={value}>{children}</TableModeContext.Provider>;
};

export const useTableMode = () => useContext(TableModeContext);