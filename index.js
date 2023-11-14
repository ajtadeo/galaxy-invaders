// const { setTimer, Circle, Randomizer } = require('chs-js-lib');
import { setTimer, Circle, Randomizer } from 'chs-js-lib';

// colors
// var backgroundColor = new Color(36, 36, 36);

// // draw 
// function setUp(){
//   setBackgroundColor(backgroundColor)
// }

// if (typeof start === 'function') {
//   setUp();
// }
window.onload = function() {
  setTimer(function() {
    let circle = new Circle(10);
    circle.setPosition(
      Randomizer.nextInt(getWidth()),
      Randomizer.nextInt(getHeight())
    );
    circle.setColor(Randomizer.nextColor());
    add(circle);
  }, 100);
}