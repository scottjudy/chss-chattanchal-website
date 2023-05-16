import React, { useEffect, useState } from "react";
import NavBar from "../../../components/NavBar";
import styles from "../../../styles/admin/admission/confirmation/Confirmation.module.css";
import Axios from "../../../../stores/Axios";
import Popup from "../../../components/common/Popup";
// import Item from "../../../components/admin/verification/Item";

// const primary = "#ccc";
// const secondary = "#bbb";

export default function Confirmation() {
  const [visible, setVisibile] = useState(false);
  // const [visibleProfile, setVisibileProfile] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  function loadData() {
    setError("");
    Axios.get("admin/students-to-confirm")
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err.response == undefined) {
          setError("Server connection error");
        } else {
          setError(err.response.data);
        }
      });
  }

  function confirmStudent(id) {
    setError("");
    Axios.patch(`admin/confirm-student?studentId=${id}`)
      .then((res) => {
        setVisibile(true)
        console.log(visible)
        loadData();
      })
      .catch((err) => {
        if (err.response == undefined) {
          setError("Server connection error");
        } else {
          setError(err.response.data);
        }
      });
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const filteredData = data.filter((item) => {
    const { name, admissionNo } = item;
    const searchFields = `${name}${admissionNo}`.toLowerCase();
    return searchFields.includes(searchQuery.toLowerCase());
  });

  const sortedData = filteredData.sort((a, b) => {
    if (sortColumn) {
      const columnA = a[sortColumn];
      const columnB = b[sortColumn];

      if (typeof columnA === "string" && typeof columnB === "string") {
        if (isDate(columnA) && isDate(columnB)) {
          // Sort date strings
          const dateA = parseDate(columnA);
          const dateB = parseDate(columnB);
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        } else if (!isNaN(parseFloat(columnA)) && !isNaN(parseFloat(columnB))) {
          // Sort number strings
          const numA = parseFloat(columnA);
          const numB = parseFloat(columnB);
          return sortOrder === "asc" ? numA - numB : numB - numA;
        } else {
          // Sort character strings
          if (columnA < columnB) {
            return sortOrder === "asc" ? -1 : 1;
          }
          if (columnA > columnB) {
            return sortOrder === "asc" ? 1 : -1;
          }
        }
      }
    }
    return 0;
  });

  function isDate(dateString) {
    // Check if a string represents a valid date
    const dateRegex = /^\d{2}[./-]\d{2}[./-]\d{4}$/;
    return dateRegex.test(dateString);
  }

  function parseDate(dateString) {
    // Parse a date string in format "DD-MM-YYYY" or "DD/MM/YYYY" to a Date object
    const [day, month, year] = dateString.split(/[./-]/);
    return new Date(year, month - 1, day);
  }

  const getSortIndicator = (column) => {
    if (sortColumn === column) {
      return sortOrder === "asc" ? "▲" : "▼";
    }
    return "";
  };

  useEffect(loadData, []);

  return (
    <>
      <NavBar />
      <Popup visible={visible} onChange={setVisibile} text={"Admission Confirmed for Student"}/>
      <div className={styles.main}>
        <div className={styles.header}>
          <span>
            <img
              src="/imgs/AdmissionImages/confirmIcon.png"
              style={styles.newAdmissionImg}
            />
            <h1>Confirmation</h1>
          </span>
          <hr />
          Home &gt; Admission &gt; <code>Confirmation</code>
        </div>
        <div className={styles.table} >


          <div >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <input
                type="text"
                placeholder="Search Name/Adm No"
                value={searchQuery}
                onChange={handleSearch}
                className={styles.searchBox}
              />
              <code style={{ textAlign: "center", color: "red", left: 0 , minWidth: 0}}>
                {error}
              </code>
            </div>

            <div className={styles.tableBox}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th onClick={() => handleSort("name")}>
                      Name {getSortIndicator("name")}
                    </th>
                    <th onClick={() => handleSort("class")}>
                      Class {getSortIndicator("class")}
                    </th>
                    <th onClick={() => handleSort("admissionNo")}>
                      Adm No. {getSortIndicator("admissionNo")}
                    </th>
                    <th onClick={() => handleSort("dob")}>
                      D.O.B {getSortIndicator("dob")}
                    </th>
                    <th></th>
                  </tr>
                </thead>

                <tbody className={styles.tableBody}>
                  {sortedData.length === 0 ? (
                    <tr>
                      <td colSpan="">No data found</td>
                    </tr>
                  ) : (
                    sortedData.map((item) => (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.class}</td>
                        <td>{item.admissionNo}</td>
                        <td>{item.dob}</td>
                        <td>
                          <button
                            style={{ marginLeft: "30%" }}
                            className={styles.deleteBtn}
                            name=""
                            onClick={() => confirmStudent(item._id)}
                          >
                            Confirm
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
