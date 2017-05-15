import React from "react";

class Progress extends React.Component {
  render() {
    let props     = this.props,
        style    = {},
        className = "bar";

    if (props.infinite) {
      className += " infinite";
    } else {
      style.width = `${props.width || 0}%`;
    }

    return (
      <section id="progress">
        <header>
          <div className={className}>
            <div style={style} />
          </div>

          <p>{props.message}&#8230;</p>
        </header>
      </section>
    );
  }
}

Progress.propTypes = {
  infinite : React.PropTypes.bool,
  message  : React.PropTypes.string.isRequired,
  width    : React.PropTypes.number
};

export default Progress;
