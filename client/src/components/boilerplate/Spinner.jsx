import React from "react";

function Spinner() {
  return (
    <div class="spinner-container">
      <div class="spinner">
        <div class="bar" style="--i: 0"></div>
        <div class="bar" style="--i: 1"></div>
        <div class="bar" style="--i: 2"></div>
        <div class="bar" style="--i: 3"></div>
        <div class="bar" style="--i: 4"></div>
        <div class="bar" style="--i: 5"></div>
        <div class="bar" style="--i: 6"></div>
        <div class="bar" style="--i: 7"></div>
        <div class="bar" style="--i: 8"></div>
        <div class="bar" style="--i: 9"></div>
        <div class="bar" style="--i: 10"></div>
        <div class="bar" style="--i: 11"></div>
      </div>
    </div>
  );
}

export default Spinner;
