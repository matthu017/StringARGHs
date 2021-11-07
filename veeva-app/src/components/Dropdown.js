import React from "react";

class Dropdown extends React.Component {
  constructor(props){
    super(props);
    this.props = props;
    this.handleChange = props.onChange.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      category: props.category,
      values: props.values,
      value: props.value,
    }
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const options = []
    for (let value of this.state.values){
        options.push(<option value={value}>{value}</option>);
    }

    return (
        <label>
          {this.state.category}
          <select value={this.state.value} onChange={this.handleChange}>
            {options}
          </select>
        </label>
    );
  }
}
export default Dropdown;
