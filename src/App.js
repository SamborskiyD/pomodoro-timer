import './App.css';
import React from 'react';



class Controller extends React.Component{
  constructor(props) {
    super(props);
  }

render(){
  return (
    <div className='controller-box controller-box_style display_flex'>
      <h1 className='title text' id={this.props.titleID}>{this.props.title}</h1>
      <div className='controller display_flex'>

        <button className='controller__button button_style' 
          id={this.props.minID}
          onClick={this.props.onClick}
          value="-">
            <i class="bi bi-caret-down-fill"></i>
        </button>

        <div className="duration text" id={this.props.lengthID}>{this.props.length}</div>

        <button className='controller__button button_style'
          id={this.props.addID}
          onClick={this.props.onClick}
          value="+">
          
          <i class="bi bi-caret-up-fill"></i>
        </button>

      </div>
    </div>
  );}
}





export default class App extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      breakTime: 5,
      sessionTime: 25,
      timerType: "Session",
      timerState: "stopped",
      timer: 1500, 
      intervalId: ""
    }

    this.setBrkLength = this.setBrkLength.bind(this);
    this.setSeshLength = this.setSeshLength.bind(this);
    this.lengthControl = this.lengthControl.bind(this);
    this.reset = this.reset.bind(this);
    this.decrementTimer = this.decrementTimer.bind(this);
    this.timerControl = this.timerControl.bind(this);
    this.typeControl = this.typeControl.bind(this);
    this.changeType = this.changeType.bind(this);
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);

  }

  setBrkLength(event) {
    this.lengthControl(
      'breakTime',
      event.currentTarget.value,
      this.state.breakTime,
      'Session'
    );
  }
  setSeshLength(event) {
    this.lengthControl(
      'sessionTime',
      event.currentTarget.value,
      this.state.sessionTime,
      'Break'
    );
  }
  lengthControl(stateToChange, sign, currentLength, timerType) {
    if (this.state.timerState === 'running') {
      return;
    }
    if (this.state.timerType === timerType) {
      if (sign === '-' && currentLength !== 1) {
        this.setState({ [stateToChange]: currentLength - 1 });
      } else if (sign === '+' && currentLength !== 60) {
        this.setState({ [stateToChange]: currentLength + 1 });
      }
    } else if (sign === '-' && currentLength !== 1) {
      this.setState({
        [stateToChange]: currentLength - 1,
        timer: currentLength * 60 - 60
      });
    } else if (sign === '+' && currentLength !== 60) {
      this.setState({
        [stateToChange]: currentLength + 1,
        timer: currentLength * 60 + 60
      });
    }
  }

  clockify() {
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return minutes + ':' + seconds;
  }

  reset() {
    this.setState({
      breakTime: 5,
      sessionTime: 25,
      timerState: "stopped",
      timerType: "Session",
      timer: 1500, 
      intervalId: clearInterval(this.state.intervalId)
    })
  }

  decrementTimer() {
    if (this.state.timerState === "running")
    {
      this.setState({timer: this.state.timer - 1});
    }
  }

  typeControl() {
    if (this.state.timer <= 0)
    {
      this.changeType();
      document.getElementById("alarm").currentTime = 0;
      document.getElementById("alarm").play();
    }
    if (this.state.timer <= 61)
    {
      let elements = document.getElementsByClassName("clock_text");
      for (let i = 0; i < elements.length; i++)
      {
        elements[i].style.color = "red";
      }
    }
    else
    {
      let elements = document.getElementsByClassName("clock_text");
      for (let i = 0; i < elements.length; i++)
      {
        elements[i].style.color = "#333533";
      }
    }

  }

  changeType() {
    if(this.state.timerType === "Session")
    {
      this.setState({timerType: "Break", timer: this.state.breakTime * 60});
    }
    else
    {
      this.setState({timerType: "Session", timer: this.state.sessionTime * 60});
    }
  }

  timerControl() {
    this.setState({
      intervalId: setInterval(() => {
        this.decrementTimer();
        this.typeControl();
      }, 1000)
    });
  }

  start() {
    if (this.state.timerState === "stopped") {
      this.setState({timerState: "running"});
      this.timerControl();
    }
  }

  pause() {
    if (this.state.timerState === "running") {

      this.setState({timerState: "stopped", intervalId: clearInterval(this.state.intervalId)});
    }
  }

render(){
  return (
    <div className="App App_style display_flex">
      <div className='wrapper wrapper_style display_flex'>

      <div className='clock clock_style display_flex'>
        <div className='clock_text'>{this.state.timerType}</div>
        <div className='clock_text timer'>{this.clockify()}</div>
      </div>
        
        <div className='button-box display_flex'>
          <button className='button-box__button button_style' onClick={this.start}><i class="bi bi-play-fill"></i></button>
          <button className='button-box__button button_style' onClick={this.pause}><i class="bi bi-pause"></i></button>
          <button className='button-box__button button_style' onClick={this.reset}><i class="bi bi-arrow-clockwise"></i></button>
        </div>

        <div className='controllers-wrapper display_flex'>

          <Controller 
            addID="break-increment"
            length={this.state.breakTime}
            lengthID="break-length"
            minID="break-decrement"
            onClick={this.setBrkLength}
            title="Break Length"
            titleID="break-label"
          />

          <Controller 
            addID="session-increment"
            length={this.state.sessionTime}
            lengthID="session-length"
            minID="session-decrement"
            onClick={this.setSeshLength}
            title="Session Length"
            titleID="session-label"
          />
        </div>
        <audio id="alarm" preload='auto' src="https://cdn.pixabay.com/audio/2022/03/10/audio_519eb9904d.mp3">

        </audio>

      </div>
    </div>
  );}
}

