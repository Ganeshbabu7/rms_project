import { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import DialogueBox from "./DialogueBox";

interface CommonTableProps {
  columns: readonly Column[];
  rows: readonly Data[];
  setData: (state: any) => void;
  updateData: (state: any) => void;
  apiName: string;
  editId: string;
}

interface CommonTableRow {
  id: string;
}

export interface Column {
  id: keyof Data;
  label: string;
  minWidth?: number;
  align?: "left";
}

export interface Data {
  [key: string]: string | number;
}

function CommonTable({
  columns,
  rows,
  setData,
  updateData,
  apiName,
  editId,
}: CommonTableProps) {
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState<CommonTableRow>({ id: "" });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof Data>("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRequestSort = (
    _: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Handle Edit :
  const handleEdit = async (row: Object) => {
    try {
      setData(row);
    } catch (error: any) {
      console.log(error);
    }
  };

  // Handle Delete :
  const handleDelete = async (row: Object) => {
    try {
      setOpen(!open);
      // setRow(row);
      setRow(row as CommonTableRow);
    } catch (error: any) {
      console.log(error);
      toast(error.response.data.message);
    }
  };

  // const sortedRows = useMemo(() => {
  //   return rows.slice().sort((a, b) => {
  //     const aValue = a[orderBy];
  //     const bValue = b[orderBy];
  //     if (typeof aValue === "number" && typeof bValue === "number") {
  //       return order === "asc" ? aValue - bValue : bValue - aValue;
  //     }
  //     if (typeof aValue === "string" && typeof bValue === "string") {
  //       return order === "asc"
  //         ? aValue.localeCompare(bValue)
  //         : bValue.localeCompare(aValue);
  //     }
  //     return 0;
  //   });
  // }, [order, orderBy]);

  const generateSerialNumber = (index: number) => {
    return index + 1 + page * rowsPerPage;
  };

  const sortedRows = rows.slice().sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    if (typeof aValue === "number" && typeof bValue === "number") {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    }
    if (typeof aValue === "string" && typeof bValue === "string") {
      return order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "2em" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  sx={{ fontSize: 16, fontWeight: 600 }}
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={(event) => handleRequestSort(event, column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.code}
                    style={{
                      backgroundColor:
                        row.currentQuantity <= row.thresholdQuantity
                          ? "rgba(255, 0, 0, 0.1)"
                          : "inherit",
                    }}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === "sNo" ? (
                            generateSerialNumber(index + page * rowsPerPage)
                          ) : (
                            <>
                              {column.id !== "actions" ? (
                                value
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <IconButton
                                    aria-label="edit"
                                    onClick={() => handleEdit(row)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    aria-label="delete"
                                    onClick={() => handleDelete(row)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </div>
                              )}
                            </>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {open ? (
        <DialogueBox
          open={open}
          setOpen={setOpen}
          updateData={updateData}
          apiName={apiName}
          editId={editId}
          row={row}
        />
      ) : null}
    </Paper>
  );
}

export default CommonTable;
