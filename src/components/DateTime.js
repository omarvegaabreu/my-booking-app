import React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const Input = ({ onChange, placeholder, value, isSecure, id, onClick }) => <input onChange={onChange} placeholder={placeholder} value={value} isSecure={isSecure} id={id} onClick={onClick} />

export default class DateTime extends React.Component {
  // The constructor of the component.
  // It is the first method that is called
  // up on creation of the component.
  constructor(props) {
    super(props)
    // The state object.
    // Initializing the date variable to the
    // current date.
    this.state = { date: new Date() }
    // this.dateChanged = this.dateChanged.bind(this)
  }

  // This is called when the user selects a date
  // using the picker.
  // dateChanged(newdate) {
  //   this.setState({ date: newdate })
  // }

  // The render() method is responsible for
  // displaying the changes onto the screen.
  render() {
    // Returning the DatePicker for display.
    return (
      <div>
        <DatePicker dateFormat="MM/dd/yyyy" selected={this.state.date} onChange={date => this.setState({ date })} />
      </div>
    )
  }
}
