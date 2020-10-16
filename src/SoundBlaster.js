import React from 'react';

class SoundBlaster extends React.Component {
  constructor(props) {
    super(props);

    this.compute = this.compute.bind(this);
    this.audio = null;
  }

  compute(props) {
    let beep = "audio/single.mp3";
    let sec30 = "audio/s30.mp3";
    let c5 = "audio/c5.mp3";

    let sec = 1000;

    let timeline = [
      [props.turn - 30 * sec, sec30],
      [props.turn - 5 * sec, c5]
    ];
    var step = 60 * sec;
    var moment = step;
    while (moment < props.turn - 30 * sec) {
      timeline.push([moment, beep]);
      moment += step;
    }
    return timeline;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let timeline = this.compute(this.props);
    for (var i = 0; i < timeline.length; ++i) {
      if (prevProps.time !== 0 &&
          prevProps.time < timeline[i][0] &&
          this.props.time >= timeline[i][0]) {
        this.audio = new Audio(timeline[i][1]);
        this.audio.play();
      }
    }
    if (this.props.time <= 1000 && this.audio != null) {
      this.audio.pause();
      this.audio = null;
    }
  }

  render() {
    return "";
  }
}

export default SoundBlaster;
