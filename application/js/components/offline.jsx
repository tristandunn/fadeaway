import React from "react";

class Offline extends React.Component {
  render() {
    return (
      <section id="offline">
        <header>
          <h1>You are currently offline.</h1>

          <p>
            Please check your network connection and try again.
          </p>
        </header>
      </section>
    );
  }
}

export default Offline;
