import React from "react"
import { Row, Col, Button } from "reactstrap"
import BigImg from "../images/cafe-table.jpg"

const Main = props => {
  return (
    <div>
      <Row noGutters className="text-center align-items-center my-2">
        <Col>
          <p className="booking-table h3">
            Make your reservation here
            <i className="fa fa-table ml-2 fa-2x table-icon" aria-hidden="true"></i>
          </p>
          <Button
            color="info"
            className="book-table-btn my-4"
            size="lg"
            onClick={() => {
              props.setPage(1)
            }}
          >
            Book a Table
          </Button>
        </Col>
      </Row>
      <Row noGutters className="text-center big-img-container">
        <Col>
          <img src={BigImg} alt="cafe" className="big-img" />
        </Col>
      </Row>
    </div>
  )
}

export default Main
