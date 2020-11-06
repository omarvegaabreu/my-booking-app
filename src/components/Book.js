import React, { useEffect } from "react";
import { useState } from "react";
import {
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Button,
} from "reactstrap";
import Table from "./Table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Book = (props) => {
  const [totalTables, setTotalTables] = useState([]);

  //User's selection
  const [selection, setSelection] = useState({
    table: { id: null, name: null },
    date: new Date(),
    time: null,
    location: "Any location",
    size: 0,
  });

  //User's booking details
  const [booking, setBooking] = useState({
    name: "",
    phone: "",
    email: "",
    parties: null,
  });

  //Available locations
  const [locations] = useState(["Any location", "Patio", "Inside", "Bar"]);

  const [times] = useState([
    "9AM",
    "10AM",
    "11AM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM",
  ]);

  //Basic reservation validation
  const [reservationError, setReservationError] = useState(false);

  //date value
  const dateValue = selection.date.toISOString().split("T")[0];

  const getDate = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = selection.date.getDate();
    const month = months[selection.date.getMonth()];
    const year = selection.date.getFullYear();

    const date = month + " " + day + " " + year;
    let time = selection.time.slice(0, -2);
    time = selection.time > 12 ? time + 12 + ":00" : time + ":00";

    console.log(date);
    console.log(time);
    const datetime = new Date(date + " " + time);
    console.log(datetime);

    return datetime;
  };

  const getEmptyTables = () => {
    let tables = totalTables.filter((table) => table.isAvailable);
    return tables.length;
  };

  useEffect(() => {
    // Check availability of tables from DB when a date and time is selected
    if (selection.time && selection.date) {
      async function fetchData() {
        let dateTime = getDate();
        let res = await fetch(`http://192.168.0.37:27017/availability`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: dateTime,
          }),
        });
        res = await res.json();
        console.log(res);
        // Filter available tables with location and group size criteria
        let tables = res.tables.filter(
          (table) =>
            (selection.size > 0 ? table.capacity >= selection.size : true) &&
            (selection.location !== "Any Location"
              ? table.location === selection.location
              : true)
        );
        setTotalTables(tables);
      }
      fetchData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.time, selection.date, selection.size, selection.location]);

  //Make reservation if all info provided
  const reserve = async () => {
    if (
      (booking.name.length === 0) |
      (booking.phone.length === 0) |
      (booking.email.length === 0) |
      (booking.parties.length === 0)
    ) {
      console.log("Incomplete reservation details");
      setReservationError(true);
    } else {
      const datetime = getDate();
      let res = await fetch(`http://192.168.0.37:27017/reserve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...booking,
          date: datetime,
          table: selection.table.id,
        }),
      });
      res = await res.text();
      console.log("Reserved: " + res);
      props.setPage(2);
    }
  };

  const selectTable = (table_name, table_id) => {
    setSelection({
      ...selection,
      table: {
        name: table_name,
        id: table_id,
      },
    });
  };

  const getSizes = () => {
    let newSizes = [];
    for (let i = 1; i < 8; i++) {
      newSizes.push(
        <DropdownItem
          key={i}
          className="booking-dropdown-item"
          onClick={(e) => {
            let newSel = {
              ...selection,
              table: {
                ...selection.table,
              },
              size: i,
            };
            setSelection(newSel);
          }}
        >
          {i}
        </DropdownItem>
      );
    }
    return newSizes;
  };

  const getLocations = () => {
    let newLocations = [];
    locations.forEach((loc) => {
      newLocations.push(
        <DropdownItem
          key={loc}
          className="booking-dropdown-item"
          onClick={(_) => {
            let newSel = {
              ...selection,
              table: {
                ...selection.table,
              },
              location: loc,
            };
            setSelection(newSel);
          }}
        >
          {loc}
        </DropdownItem>
      );
    });

    return newLocations;
  };

  const getTimes = () => {
    let newTimes = [];
    times.forEach((time) => {
      newTimes.push(
        <DropdownItem
          key={time}
          className="booking-dropdown-item"
          onClick={(_) => {
            let newSel = {
              ...selection,
              table: {
                ...selection.table,
              },
              time: time,
            };
            setSelection(newSel);
          }}
        >
          {time}
        </DropdownItem>
      );
    });

    return newTimes;
  };

  const getTables = () => {
    console.log("Getting tables.");
    if (getEmptyTables() > 0) {
      let tables = [];
      totalTables.forEach((table) => {
        if (table.isAvailable) {
          tables.push(
            <Table
              key={table._id}
              id={table._id}
              chairs={table.capacity}
              name={table.name}
              empty
              selectTable={selectTable}
            />
          );
        } else {
          tables.push(
            <Table
              key={table._id}
              id={table._id}
              chairs={table.capacity}
              name={table.name}
              selectTable={selectTable}
            />
          );
        }
      });
      return tables;
    }
  };

  return (
    <div>
      <Row noGutters className="text-center align-items-center my-2">
        <Col>
          <p className="booking-table h3">
            {!selection.table.id ? "Book a table" : "Confirm Reservation"}
            <i
              className={
                !selection.table.id
                  ? "fas fa-chair ml-2 "
                  : "fas fa-clipboard ml-2 "
              }
            ></i>
          </p>
          <p className="selected-table">
            {selection.table.id
              ? "You are booking table " + selection.table.name
              : null}
          </p>
          {reservationError ? (
            <p className="reservation-error">
              * Please fill out all of the details.
            </p>
          ) : null}
        </Col>
      </Row>
      {!selection.table.id ? (
        <div id="reservation-stuff">
          <Row noGutters className="text-center align-items-center">
            <Col xs="12" sm="3">
              <DatePicker
                selected={selection.date}
                placeholder="Select Date"
                required="required"
                className="booking-dropdown"
                dateFormat="MM/dd/yyyy"
                value={dateValue}
                onChange={(e) => {
                  console.log("311" + new Date(new Date(e)));
                  console.log("311" + new Date(e));
                  // console.log("this is e " + e);
                  if (!isNaN(new Date(new Date(e)))) {
                    console.log("413" + new Date(new Date(e)));
                    let newSel = {
                      ...selection,
                      table: {
                        ...selection.table,
                      },
                      date: new Date(e),
                    };

                    setSelection(newSel);
                  } else {
                    console.log("Invalid date");
                    let newSel = {
                      ...selection,
                      table: {
                        ...selection.table,
                      },
                      date: new Date(),
                    };

                    setSelection(newSel);
                  }
                }}
              />
            </Col>

            <Col xs="12" sm="3">
              <UncontrolledDropdown>
                <DropdownToggle color="none" caret className="booking-dropdown">
                  {selection.time === null ? "Select a Time" : selection.time}
                </DropdownToggle>
                <DropdownMenu right className="booking-dropdown-menu">
                  {getTimes()}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col xs="12" sm="3">
              <UncontrolledDropdown>
                <DropdownToggle color="none" caret className="booking-dropdown">
                  {selection.location}
                </DropdownToggle>
                <DropdownMenu right className="booking-dropdown-menu">
                  {getLocations()}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
            <Col xs="12" sm="3">
              <UncontrolledDropdown>
                <DropdownToggle color="none" caret className="booking-dropdown">
                  {selection.size === 0
                    ? "Select a Party Size"
                    : selection.size.toString()}
                </DropdownToggle>
                <DropdownMenu right className="booking-dropdown-menu">
                  {getSizes()}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
          </Row>
          <Row noGutters className="tables-display">
            <Col>
              {getEmptyTables() > 0 ? (
                <p className="available-tables">{getEmptyTables()} available</p>
              ) : null}

              {selection.date && selection.time ? (
                getEmptyTables() > 0 ? (
                  <div>
                    <div className="table-key">
                      <span className="empty-table"></span> &nbsp; Available
                      &nbsp;&nbsp;
                      <span className="full-table"></span> &nbsp; Unavailable
                      &nbsp;&nbsp;
                    </div>
                    <Row noGutters>{getTables()}</Row>
                  </div>
                ) : (
                  <p className="table-display-message">No Available Tables</p>
                )
              ) : (
                <p className="table-display-message">
                  Please select a date and time for your reservation.
                </p>
              )}
            </Col>
          </Row>
        </div>
      ) : (
        <div id="confirm-reservation-stuff">
          <Row
            noGutters
            className="text-center justify-content-center reservation-details-container"
          >
            <Col xs="12" sm="3" className="reservation-details">
              <Input
                type="text"
                bsSize="lg"
                placeholder="Name"
                className="reservation-input"
                value={booking.name}
                onChange={(e) => {
                  setBooking({
                    ...booking,
                    name: e.target.value,
                  });
                }}
              />
            </Col>
            <Col xs="12" sm="3" className="reservation-details">
              <Input
                type="text"
                bsSize="lg"
                placeholder="Phone Number"
                className="reservation-input"
                value={booking.phone}
                onChange={(e) => {
                  setBooking({
                    ...booking,
                    phone: e.target.value,
                  });
                }}
              />
            </Col>
            <Col xs="12" sm="3" className="reservation-details">
              <Input
                type="text"
                bsSize="lg"
                placeholder="Email"
                className="reservation-input"
                value={booking.email}
                onChange={(e) => {
                  setBooking({
                    ...booking,
                    email: e.target.value,
                  });
                }}
              />
            </Col>
          </Row>
          <Row noGutters className="text-center">
            <Col>
              <Button
                color="none"
                className="book-table-btn"
                onClick={(_) => {
                  reserve();
                }}
              >
                Book Now
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default Book;
