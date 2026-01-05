import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TablePagination,
  useTheme,
} from "@mui/material";
import {
  GridColDef,
  GridRenderCellParams,
  GridApiCommon,
  GridRowId,
  GridTreeNodeWithRender,
} from "@mui/x-data-grid";

// تعریف انواع برای فیلترها
interface Filters {
  page: number;
  size: number;
  [key: string]: any; // برای پشتیبانی از فیلترهای اضافی
}

// ایجاد اینترفیس برای پارامترهای renderCell سفارشی
interface CustomGridRenderCellParams
  extends Omit<
    GridRenderCellParams,
    "api" | "colDef" | "cellMode" | "hasFocus" | "tabIndex"
  > {
  api?: GridApiCommon;
  colDef?: GridColDef;
  cellMode?: "view" | "edit";
  hasFocus?: boolean;
  tabIndex?: number;
}

interface VerticalTableProps {
  rows: any[];
  columns: GridColDef[];
  filters: Filters;
  setFilters: (filters: Filters) => void;
  rowCount: number;
  loading?: boolean;
  withHeader?: boolean;
}

const VerticalTable: React.FC<VerticalTableProps> = ({
  rows,
  columns,
  filters,
  setFilters,
  rowCount,
  loading = false,
  withHeader = false,
}) => {
  const theme = useTheme();
  const { page, size } = filters;

  // ایجاد پارامترهای کامل برای renderCell
  const createRenderCellParams = (
    row: any,
    column: GridColDef,
    rowIndex: number
  ): CustomGridRenderCellParams => {
    const id = row.id || rowIndex;
    return {
      id,
      field: column.field,
      value: row[column.field],
      row,
      rowNode: {
        id,
        depth: 0,
        parent: null as unknown as GridRowId,
        groupingKey: null,
        groupingField: null,
        position: "body",
        type: "leaf",
        mode: "view",
      } as GridTreeNodeWithRender,
      colDef: column,
      cellMode: "view",
      hasFocus: false,
      tabIndex: -1,
      formattedValue:
        column.valueFormatter && typeof column.valueFormatter === "function"
          ? column.valueFormatter({
              value: row[column.field],
              field: column.field,
              id,
              api: {} as GridApiCommon,
            })
          : row[column.field],
      isEditable: false,
      api: {} as GridApiCommon,
    };
  };

  // محاسبه داده‌های ترانسپوز شده
  const transposedData = useMemo(() => {
    if (!rows || rows.length === 0 || !columns || columns.length === 0)
      return [];

    return columns.map((col) => ({
      field: col.field,
      headerName: col.headerName || col.field,
      values: rows.map((row, rowIndex) => ({
        value: row[col.field],
        renderParams: createRenderCellParams(row, col, rowIndex),
      })),
      renderCell: col.renderCell,
      align: col.align || "center",
      headerAlign: col.headerAlign || "center",
    }));
  }, [rows, columns]);

  // مدیریت تغییر صفحه
  const handleChangePage = (event: unknown, newPage: number) => {
    setFilters({ ...filters, page: newPage+1 });
  };

  // مدیریت تغییر اندازه صفحه
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newSize = parseInt(event.target.value, 10);
    setFilters({ ...filters, size: newSize, page: 1 });
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">در حال بارگذاری...</Typography>
      </Paper>
    );
  }

  if (transposedData.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">داده‌ای برای نمایش وجود ندارد</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="vertical table">
          {withHeader && (
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    minWidth: 150,
                    position: "sticky",
                    left: 0,
                    zIndex: theme.zIndex.appBar + 1,
                  }}
                >
                  عنوان/رکورد
                </TableCell>
                {rows.map((_, index) => (
                  <TableCell
                    key={index}
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: theme.palette.grey[200],
                      minWidth: 150,
                    }}
                  >
                    رکورد {index + 1 + (page - 1) * size}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          )}

          <TableBody>
            {transposedData.map((column, colIndex) => (
              <TableRow key={colIndex} hover>
                <TableCell
                  component="th"
                  scope="row"
                  align={column.headerAlign as any}
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: theme.palette.mode==="light"?theme.palette.grey[100]:theme.palette.grey[700],
                    position: "sticky",
                    left: 0,
                    zIndex: theme.zIndex.appBar,
                  }}
                >
                  {column.headerName}
                </TableCell>

                {column.values.map((cell, rowIndex) => (
                  <TableCell
                    key={rowIndex}
                    align={column.align as any}
                    sx={{ minWidth: 150 }}
                  >
                    {column.renderCell
                      ? column.renderCell(
                          cell.renderParams as GridRenderCellParams
                        )
                      : cell.value != null
                      ? String(cell.value)
                      : "—"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display={"flex"} justifyContent={"flex-end"} width={"100%"}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          // component="div"
          lang="fa"
          // sx={{direction:"rtl"}}
          sx={{
            "& .MuiTablePagination-actions": {
              direction: "rtl",
            },
          }}
          count={rowCount}
          rowsPerPage={size}
          page={page - 1}
          dir="rtl"
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="تعداد ردیف"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} از ${count !== -1 ? count : `نمایش بیشتر ${to}`}`
          }
        />
      </Box>
    </Paper>
  );
};

export default VerticalTable;
