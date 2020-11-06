import React from "react"
import { Row, Col } from "reactstrap"

const ThankYou = () => {
  return (
    <div>
      <Row noGutters className="text-center">
        <Col>
          <p className="thanks-header">Thank You!</p>
          <i className="fas fa-pizza-slice thank-you-pizza"></i>
          <p className="thanks-subtext">You should receive an email with the details of your reservation.</p>
        </Col>
      </Row>
    </div>
  )
}

export default ThankYou
