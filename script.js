var stage = document.getElementById("stage");
stage.setAttribute('width', '680');
stage.setAttribute('height', '520');
var ctx = stage.getContext("2d");

var object_color = "#0095DD";
var x  = stage.width/2;
var y = stage.height-30;
var ball_speed = 2;
var dx = ball_speed;
var dy = -ball_speed;
var ball_radius = 10;
var paddle_height = 10;
var paddle_width = 75;
var paddle_x = (stage.width-paddle_width)/2;
var right_pressed = false;
var left_pressed = false;
var paddle_speed = 7;

var brick_row_count = 8;
var brick_column_count = 7;
var brick_width = 82;
var brick_height = 20;
var brick_padding = 12;
var brick_offset_top = 40;
var brick_offset_left = 18;

var bricks = [];
for (c = 0; c < brick_column_count; c++) {
  bricks[c] = [];
  for (r = 0; r < brick_row_count; r++) {
    bricks[c][r] = {
      x: 0,
      y: 0,
      status: 1,
      color: '#'+Math.floor(Math.random()*16777215).toString(16),
    };
  }
}

var score = 0;
var lives = 3;

draw();

document.addEventListener("keydown", key_down_handler, false);
document.addEventListener("keyup", key_up_handler, false);
document.addEventListener("mousemove", mouse_move_handler, false);

function key_down_handler(e) {

  if (e.keyCode == 39) {
    right_pressed = true;
  }
  else if (e.keyCode == 37) {
    left_pressed = true;
  }

}


function key_up_handler(e) {

  if (e.keyCode == 39) {
    right_pressed = false;
  }
  else if (e.keyCode == 37) {
    left_pressed = false;
  }

}


function mouse_move_handler(e) {

  var relative_x = e.clientX - stage.offsetLeft;
  if (relative_x > 0 && relative_x < stage.width) {
    paddle_x = relative_x - paddle_width/2;
  }

  if (relative_x <= paddle_width/2) {
    paddle_x = 0;
  }

  if (relative_x >= stage.width - paddle_width/2) {
    paddle_x = stage.width - paddle_width;
  }


}


function draw() {

  if (right_pressed && paddle_x < stage.width-paddle_width) {
    paddle_x += paddle_speed;
  }
  else if (left_pressed && paddle_x  > 0) {
    paddle_x -= paddle_speed;
  }

  ctx.clearRect(0, 0, stage.width, stage.height);
  draw_bricks();
  draw_ball();
  draw_paddle();
  collision_detection();
  draw_score();
  draw_lives();

  x += dx;
  y += dy;

  requestAnimationFrame(draw);

}


function draw_ball() {

  ctx.beginPath();
  ctx.arc(x, y, ball_radius, 0, Math.PI*2);
  ctx.fillStyle = object_color;
  ctx.fill();
  ctx.closePath();

  if (x + dx > stage.width-ball_radius || x + dx < ball_radius) {
    dx = -dx;
  }

  if (y + dy < ball_radius) {
    dy = -dy;
  }
  else if (y + dy > stage.height-ball_radius) {
    if (x > paddle_x && x < paddle_x + paddle_width) {
        if (y = y - paddle_height) {
          dy = -ball_speed;
        }
    }
    else {
      console.log(lives);
      lives--;
      if (!lives) {
        alert('game over');
        window.location.reload();
      }
      else {
        x = stage.width/2;
        y = stage.height-30;
        dx = 2;
        dy = -2;
        paddle_x = (stage.width-paddle_width)/2;
      }

    }
  }

}


function draw_paddle() {

  ctx.beginPath();
  ctx.rect(paddle_x, stage.height-paddle_height, paddle_width, paddle_height);
  ctx.fillStyle = object_color;
  ctx.fill();
  ctx.closePath();

}


function draw_bricks() {

  for (c = 0; c < brick_column_count; c++) {
    for (r = 0; r < brick_row_count; r++) {
      if (bricks[c][r].status == 1) {
        var brick_x = (c*(brick_width+brick_padding)) + brick_offset_left;
        var brick_y = (r*(brick_height+brick_padding)) + brick_offset_top;
        bricks[c][r].x = brick_x;
        bricks[c][r].y = brick_y;
        ctx.beginPath();
        ctx.rect(brick_x, brick_y, brick_width, brick_height);
        ctx.fillStyle = bricks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }

}


function collision_detection() {

  for (c = 0; c < brick_column_count; c++) {
    for (r = 0; r < brick_row_count; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x+brick_width && y > b.y && y < b.y+brick_height) {
          dy = -dy;
          b.status = 0;
          score++;

          if (score % 2 === 0) {
            ball_speed += 0.5;
          }

          if (score == brick_row_count*brick_column_count) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }

}


function draw_lives() {

  ctx.font = "16px Arial";
  ctx.fillStyle = object_color;
  ctx.fillText("Lives: " + lives, stage.width - 65, 20);

}


function draw_score() {

  ctx.font = "16px Arial";
  ctx.fillStyle = object_color;
  ctx.fillText("Score: " + score, 8, 20);

}
