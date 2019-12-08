import React, { Component } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Snake from './Snake';
import Food from "./Food";
import GameRules from "./GameRules";


// Returning a random integer between min (inclusive) and max (inclusive).
// Used for food coordinates
// TODO: Add a check so food does not appear on the snake
const randomCoordinates = () => {
  let min = 1;
  let max = 100;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y]
}

// Set the default values for state variables
const initState = {
  score: 0,
  speed: 200,
  speedButtonName: 'Select the speed',
  intervalId: null,
  ifSpeedSelectDisabled: false,
  food: randomCoordinates(),
  direction: 'RIGHT',
  snakeCoordinates: [
    [0, 0],
    [2, 0]
  ]
}


class App extends Component {
  
  constructor(){
    super();

    this.state = initState;

    this.selectSpeed = this.selectSpeed.bind(this);
    this.startButton = this.startButton.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.moveSnake = this.moveSnake.bind(this);
    this.checkIfBorderCrossing = this.checkIfBorderCrossing.bind(this);
    this.checkIfEatItself = this.checkIfEatItself.bind(this);
    this.checkIfEatFood = this.checkIfEatFood.bind(this);
    this.enlargeSnake = this.enlargeSnake.bind(this);
    this.increaseSpeed = this.increaseSpeed.bind(this);
    this.increaseScore = this.increaseScore.bind(this);
    this.gameOver = this.gameOver.bind(this);
    
  }
  

  // Check some conditions on each component update
  // Stop the game when needed
  componentDidUpdate() {
    this.checkIfBorderCrossing();
    this.checkIfEatItself();
    this.checkIfEatFood();
  }

  selectSpeed = (eventKey) => {
    if (eventKey === '1') { this.setState({ speed: 200, speedButtonName: 'Low' }) }
    if (eventKey === '2') { this.setState({ speed: 150, speedButtonName: 'Medium' }) }
    if (eventKey === '3') { this.setState({ speed: 100, speedButtonName: 'Fast' }) }
  }

  startButton() {
    if (this.state.speedButtonName === "Select the speed") {
      alert("Please, select the speed")
      return
    } 
    let i = setInterval(this.moveSnake, this.state.speed);
    this.setState({ intervalId: i, ifSpeedSelectDisabled: true})
    document.body.onkeydown = this.onKeyPress;
  }


  onKeyPress = (e) => {
    // "|| window.event" is to make it work on old versions of IE (pre IE9) where the event was not passed into the handler function.
    e = e || window.event;
    switch (e.keyCode) {
      case 37:
        this.setState({ direction: "LEFT" });
        break;
      case 38:
        this.setState({ direction: "UP" });
        break;
      case 39:
        this.setState({ direction: "RIGHT" });
        break;
      case 40:
        this.setState({ direction: "DOWN" });
        break;
      default:
        return;
    }
  }

  // The algorithm of moving the snake.
  moveSnake = () => {
    let snake = [...this.state.snakeCoordinates];
    let head = snake[snake.length - 1];
    switch (this.state.direction) {
      case "RIGHT":
        head = [head[0] + 2, head[1]];
        break;
      case "LEFT":
        head = [head[0] - 2, head[1]];
        break;
      case "DOWN":
        head = [head[0], head[1] + 2];
        break;
      case "UP":
        head = [head[0], head[1] - 2];
        break;
      default:
        return;
    }
    // The movement is achieved by adding a new head in the selected direction
    // and removing the tail.
    snake.push(head);                    
    snake.shift();
    this.setState({ snakeCoordinates: snake })
  }

  // Check and stops the game in case if the snake touchs the border
  checkIfBorderCrossing() {
    let snake = [...this.state.snakeCoordinates];
    let head = snake[snake.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.gameOver();
    }
  }

  // Checks if the snake eats itself
  // Stops the game in case if the snake eats itself
  checkIfEatItself() {
    let snake = [...this.state.snakeCoordinates];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(coord => {
      if (head[0] === coord[0] && head[1] === coord[1]) {
        this.gameOver();
      }
    })
  }

  // Checking if snake eats food (if snake's head and food coordinates are the same).
  // Increase the snakes size, speed and user's score
  checkIfEatFood() {
    let snake = [...this.state.snakeCoordinates];
    let head = snake[snake.length - 1];
    let food = this.state.food;
    if (head[0] === food[0] && head[1] === food[1]) {
      this.setState({
        food: randomCoordinates()
      })
      this.enlargeSnake();
      this.increaseSpeed();
      this.increaseScore();
    }
  }

  enlargeSnake() {
    let newSnake = [...this.state.snakeCoordinates];
    newSnake.unshift([]);
    this.setState({ snakeCoordinates: newSnake })
  }

  increaseSpeed = () => {
    if (this.state.speed > 10) {
      let s = this.state.speed - 10
      clearInterval(this.state.intervalId);
      let i = setInterval(this.moveSnake, s)
      this.setState({ speed: s, intervalId: i })
    }
  }

  increaseScore() {
    this.setState({ score: this.state.score + 1 })
  }

  gameOver() {
    alert(`Game Over. your score is ${this.state.score}`);
    clearInterval(this.state.intervalId);
    this.setState(initState)
  }

  render() {
    return (
      <div className='div'>
        <h1>Score: {this.state.score}</h1>
        <GameRules />
        <DropdownButton className='dropdown' title={this.state.speedButtonName} disabled={this.state.ifSpeedSelectDisabled}>
          <Dropdown.Item eventKey='1' onSelect={this.selectSpeed}>Low</Dropdown.Item>
          <Dropdown.Item eventKey='2' onSelect={this.selectSpeed}>Medium</Dropdown.Item>
          <Dropdown.Item eventKey='3' onSelect={this.selectSpeed}>Fast</Dropdown.Item>
        </DropdownButton>
        <button  class="button" onClick={() => this.startButton()}>Start game!</button>
        
        <div className="game-area">
          <Snake snakeCoordinates={this.state.snakeCoordinates} />
          <Food coord={this.state.food} />
        </div> 
      </div>
    );
  }
}

export default App;
