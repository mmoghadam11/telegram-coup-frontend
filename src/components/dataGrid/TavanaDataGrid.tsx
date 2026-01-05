import React from "react";
import {
  DataGrid,
  DataGridProps,
  GridPaginationModel,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { Badge, Grid } from "@mui/material";
import { IQueryFilter } from "types/types";

interface Props extends DataGridProps {
  setFilters?: React.Dispatch<React.SetStateAction<IQueryFilter>>;
  filters?: IQueryFilter;
  hideToolbar?: boolean;
  FilterComponent?: React.ReactNode;
  filterComponentProps?: any;
}
declare module "@mui/x-data-grid" {
  interface FilterPanelPropsOverrides {
    filters?: IQueryFilter;
    setFilters?: React.Dispatch<React.SetStateAction<IQueryFilter>>;
  }
}
const TavanaDataGrid = (props: Props) => {
  const {
    setFilters,
    filters,
    hideToolbar = false,
    FilterComponent,
    filterComponentProps,
  } = props;
  const filterPanelStyles = {
    // کلاس .MuiDataGrid-filterFormOperatorInput مربوط به سلکتور اوپراتور
    "& .MuiDataGrid-filterFormOperatorInput": {
      display: "none",
    },
    // این کد برای مرتب‌سازی است و باعث می‌شود فیلد مقدار تمام عرض موجود را بگیرد
    "& .MuiDataGrid-filterForm": {
      gridTemplateColumns: "1fr 1fr 1fr", // معمولاً ستون، اوپراتور، مقدار است
      // در این حالت می‌توانیم آن را به 1fr 0fr 2fr تغییر دهیم
      // اما راهکار ساده‌تر، حذف مستقیم کلاس است.
    },
  };
  const getActiveFiltersCount = (filters: any) => {
    if (!filters) return 0;
    // فیلدهایی که نباید شمرده شوند مثل Pagination
    const excludedKeys = [
      "page",
      "size",
      "sortBy",
      "sortDir",
      "count",
      "totalElements",
    ];

    return Object.keys(filters).filter(
      (key) =>
        !excludedKeys.includes(key) &&
        filters[key] !== "" &&
        filters[key] !== null &&
        filters[key] !== undefined
    ).length;
  };
  const CustomToolbar = ({ filtersCount }: { filtersCount: number }) => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        {/* اضافه کردن Badge دور دکمه فیلتر */}
        <Badge badgeContent={filtersCount} color="primary" overlap="circular">
          <GridToolbarFilterButton />
        </Badge>
        {/* <GridToolbarExport /> */}
      </GridToolbarContainer>
    );
  };
  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sx={{ minHeight: "200px" }}>
        <DataGrid
          sx={{
            "& .MuiTablePagination-actions": { direction: "rtl" },
            "& .font-12": { fontSize: "12px" },
            "& .font-13": {
              // fontWeight: 425,
              fontSize: "13px",
              // color: "primary.main",
            },
          }}
          localeText={{
            toolbarDensity: "اندازه",
            toolbarDensityLabel: "اندازه سطر",
            toolbarDensityCompact: "کوچک",
            toolbarDensityStandard: "متوسط",
            toolbarDensityComfortable: "بزرگ",

            toolbarFilters: "فیلتر",
            toolbarFiltersLabel: "فیلتر",
            toolbarFiltersTooltipHide: "مخفی کردن فیلتر",
            toolbarFiltersTooltipShow: "نمایش فیلتر",

            toolbarExport: "دریافت خروجی",
            toolbarExportCSV: "دریافت فایل CSV",
            toolbarExportPrint: "پرینت",

            toolbarColumns: "ستون ها",
            toolbarColumnsLabel: "ستون ها",

            filterPanelAddFilter: "افزودن فیلتر",
            filterPanelRemoveAll: "حذف همه فیلترها",
            filterPanelLogicOperator: "عملگر منطقی",
            filterPanelOperator: "عملگر",
            filterPanelColumns: "ستون‌ها",
            filterPanelInputLabel: "مقدار", // قبلاً filterPanelValue بود
            filterPanelInputPlaceholder: "مقدار را وارد کنید",
            filterOperatorContains: "شامل",
            filterOperatorEquals: "برابر",
            filterOperatorStartsWith: "شروع با",
            filterOperatorEndsWith: "پایان با",
            filterOperatorIsEmpty: "تهی",
            filterOperatorIsNotEmpty: "ناتهی",
            filterOperatorIsAnyOf: "یکی از",

            columnsPanelTextFieldLabel: "یافتن ستون",
            columnsPanelTextFieldPlaceholder: "نام ستون",
            columnsPanelShowAllButton: "نمایش همه",
            columnsPanelHideAllButton: "مخفی کردن همه",

            MuiTablePagination: {
              labelRowsPerPage: "تعداد ردیف",
              lang: "fa",
              dir: "rtl",
              labelDisplayedRows: ({ from, to, count }) => {
                return `${from}–${to} از ${
                  count !== -1 ? count : `نمایش بیشتر ${to}`
                }`;
              },
            },

            noRowsLabel: "داده ای یافت نشد",
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          disableColumnMenu
          {...(setFilters && {
            onSortModelChange: (sort) => {
              setFilters((p) => ({
                ...p,
                sortBy: sort[0]?.field ?? undefined,
                sortDir: sort[0]?.sort ?? undefined,
              }));
            },
            onPaginationModelChange: (pagination: GridPaginationModel) => {
              setFilters((filters) => ({
                ...filters,
                size: pagination?.pageSize,
                page: pagination?.page + 1,
              }));
            },
            paginationMode: "server",
            paginationModel: {
              page: filters?.page ? filters?.page - 1 : 0,
              pageSize: filters?.size || 10,
            },
            // rowCount: filters?.count,
            rowCount: filters?.totalElements,
          })}
          {...props}
          slots={{
            // کل toolbar
            // ...(hideToolbar ? {} : { toolbar: GridToolbar }),
            ...(hideToolbar ? {} : { toolbar: CustomToolbar }),
            ...props?.slots,
            ...(FilterComponent && {
              filterPanel: () => <>{FilterComponent}</>,
            }),
          }}
          slotProps={{
            toolbar: {
              filtersCount: getActiveFiltersCount(filters), // پاس دادن تعداد به تولبار
            },
            // filterPanel: {
            //   sx: filterPanelStyles,
            // },
            filterPanel: {
              sx: filterPanelStyles,
              // ترکیب پروپ‌های استاندارد و پروپ‌های اختصاصی شما
              filters: props.filters,
              setFilters: props.setFilters,
              ...filterComponentProps,
              ...props.slotProps?.filterPanel,
            } as any,
            ...props?.slotProps,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default TavanaDataGrid;
