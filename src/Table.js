import { AppBar } from "@material-ui/core";
import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Pagination, Search } from "./Common";
import { makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  textStyle: {
    color: "Red",
  },
}));

const DataTable = ({ cartItems, onAdd }) => {
  const [results, setResults] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });

  const ITEMS_PER_PAGE = 150;

  const headers = [
    { name: "Title", field: "title", sortable: true },
    { name: "Authors", field: "authors", sortable: true },
    { name: "Average Rating", field: "average_rating", sortable: true },
    { name: "Price", field: "price", sortable: true },
    { name: "Add To Cart", field: "add", sortable: false },
  ];

  const classes = useStyles();

  useEffect(() => {
    const getData = () => {
      fetch(
        "https://s3-ap-southeast-1.amazonaws.com/he-public-data/books8f8fe52.json"
      )
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          setResults(json);
        });
    };

    getData();
  }, []);

  const filtered = useMemo(() => {
    let filteredResult = results;

    filteredResult = filteredResult.filter((result) => {
      if (typeof result["title"] === "string") {
        return true;
      }
      return false;
    });
    if (search) {
      filteredResult = filteredResult.filter((result) => {
        if (typeof result["title"] === "string") {
          return result["title"].toLowerCase().includes(search.toLowerCase());
        }
        return true;
      });
    }

    setTotalItems(filteredResult.length);

    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      const value = results[0][sorting.field];
      if (typeof value === "string") {
        filteredResult = filteredResult.sort(
          (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
        );
      } else {
        filteredResult = filteredResult.sort((a, b) =>
          sorting.order === "asc"
            ? a[sorting.field] - b[sorting.field]
            : b[sorting.field] - a[sorting.field]
        );
      }
    }

    return filteredResult.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [results, currentPage, search, sorting]);

  const cut = (name) => {
    let NewTitle;
    if (name.length > 35) {
      NewTitle = `${name.slice(0, 35)}....`;
      return NewTitle;
    }
    return name;
  };

  return (
    <>
      <div className="row w-100">
        <div className="col mb-3 col-12 text-center">
          <AppBar className={classes.appBar}>
            <div>
              <Typography variant="h6" className={classes.title}>
                ECS Assignment
              </Typography>
            </div>
            <div>
              <Link to="/cart">
                Cart{" "}
                {cartItems.length ? (
                  <button className="badge">{cartItems.length}</button>
                ) : (
                  ""
                )}
              </Link>{" "}
            </div>
          </AppBar>
          <div className="row mt-4 mb-4">
            <div className="col-md-6  flex-row-reverse ">
              <Search
                onSearch={(value) => {
                  setSearch(value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {totalItems ? (
            <>
              <table className="table table-striped">
                <TableHeader
                  headers={headers}
                  onSorting={(field, order) => setSorting({ field, order })}
                />

                <tbody>
                  {filtered.map((r) => (
                    <tr key={r["title"]}>
                      <td className={classes.textStyle}>{cut(r["title"])}</td>
                      <td>{r["authors"]}</td>
                      <td>{r["average_rating"]}</td>
                      <td>{r["price"]}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => onAdd(r)}
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="row">
                <div className="col-md-6">
                  <Pagination
                    total={totalItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="row mt-4">
              <div className="col-md-6">
                <h4>No result found</h4>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DataTable;
