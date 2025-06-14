import { useEffect, useState } from "react";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { File, StatusRequest } from "@/types/api";
import { getDownloads } from "@/api/requests";

dayjs.extend(calendar);
dayjs.extend(duration);
dayjs.extend(relativeTime);

const parseISOWithMicroseconds = (value: string) => {
  const trimmedValue = value.replace(/(\.\d{3})\d+/, "$1"); // Keep only three decimal places
  return dayjs(trimmedValue);
};

const formatISOForCalendar = (value: string) => {
  if (!value) return "";

  return parseISOWithMicroseconds(value).calendar(null, {
    sameDay: "[Today at] h:mm A", // The same day ( Today at 2:30 AM )
    nextDay: "[Tomorrow]", // The next day ( Tomorrow at 2:30 AM )
    nextWeek: "dddd", // The next week ( Sunday at 2:30 AM )
    lastDay: "[Yesterday]", // The day before ( Yesterday at 2:30 AM )
    lastWeek: "[Last] dddd", // Last week ( Last Monday at 2:30 AM )
    sameElse: "MMMM DD[,] YYYY [at] hh:mm A", // Everything else ( 7/10/2011 )
  });
};

export default function StatusTable() {
  const [loading, setLoading] = useState<boolean>(false);
  const columns: GridColDef[] = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "timestamp",
      headerName: "Timestamp",
      width: 280,
      // valueFormatter: ({ value }) => {
      //    console.log("valueFormatter received:", value);
      //    return formatISOForCalendar(value);
      // },
    },
    { field: "filename", headerName: "Filename", width: 200 },
    {
      field: "url",
      headerName: "URL",
      width: 200,
      renderCell: (params) => (
        <a href={params.value as string}>{params.value}</a>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value as string}
          color={params.value == "SUCCESS" ? "success" : "error"}
          variant="outlined"
        />
      ),
    },
    {
      field: "seconds_elapsed",
      headerName: "Download Time",
      width: 150,
      valueFormatter: ({ value }) => dayjs.duration(value as string).humanize(),
    },
  ];
  const [rows, setRows] = useState<File[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState<StatusRequest>({
    page: 0,
    pageSize: 5,
  });
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const handleFetch = () => {
    setLoading(true);
    getDownloads({
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
    })
      .then(({ data: resp }) => {
        setRows(
          resp.data.map(
            (row: { [key: string]: unknown; timestamp: string }) => {
              return {
                ...row,
                timestamp: formatISOForCalendar(row.timestamp),
              };
            },
          ),
        );
        setRowCount(resp.rowCount);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleFetch();
  }, [paginationModel]);

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        paginationModel={paginationModel as GridPaginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        loading={loading}
        keepNonExistentRowsSelected
        rowCount={rowCount}
        onRowCountChange={(newRowCount) => setRowCount(newRowCount)}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
