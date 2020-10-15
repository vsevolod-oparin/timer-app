import React from 'react';

function NiceTime(props) {
  let ms = props.time;

  let canties = Math.floor(ms / 10) % 100;
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours   = Math.floor(minutes / 60);

  let cc = canties.toString().padStart(2, "0")
  let mm = (minutes % 60).toString().padStart(2, "0")
  let ss = (seconds % 60).toString().padStart(2, "0")
  let h  = hours.toString()

  return h.concat(":", mm, ":", ss, ".", cc);
}

export default NiceTime;
