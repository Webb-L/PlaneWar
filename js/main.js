const start = document.querySelector('.start');
// 开始按钮注册点击事件
start.onclick = function (e) {
  this.remove();
  document.querySelector('.game header').style.visibility = 'visible';
  const game = new Game();
  game.init();
};

let Game = function () {

};

// 初始化游戏
Game.prototype.init = function () {
  // 游戏区域
  this.gameRegion = document.querySelector('.game');
  // 分数
  this.fraction = document.querySelector('.fraction span');
  // 时间
  this.time = document.querySelector('.time span');

  // 创建敌方飞机时间（毫秒）
  this.createTime = 1000;
  // 敌方飞机移动时间（毫秒）
  this.movingTime = 800;

  // 游戏区域宽度
  this.width = this.gameRegion.clientWidth;
  // 游戏区域高度
  this.height = this.gameRegion.clientHeight;

  // 白色飞机分数
  this.whitePlane = 10;
  // 蓝色飞机分数
  this.bluePlane = 20;
  // 红色飞机分数
  this.redPlane = 30;

  // 我方飞机信息
  this.me = {x: 0, y: 0, width: 0, height: 0};

  this.timing();
  this.randomPlane();
  this.ourPlane();
  this.collision();
};

// 计时器
Game.prototype.timing = function () {
  let second = 1;
  setInterval(() => {
    this.time.innerText = second++;
  }, 1000)
};

// 随机生成敌方飞机
Game.prototype.randomPlane = function () {
  let that = this;
  // 创建飞机
  setInterval(() => {
    let img = new Image();
    let type = Math.floor(Math.random() * (4 - 1) + 1);
    img.src = '../img/e' + type + '.png';
    img.setAttribute('data-type', type);
    img.setAttribute('class', 'enemy');
    img.style.position = 'absolute';
    img.style.top = "-80px";
    if (img.complete) {
      img.style.left = Math.floor(Math.random() * (that.width - img.width)) + 'px';
    } else {
      img.onload = function () {
        img.onload = null;
        img.style.left = Math.floor(Math.random() * (that.width - img.width)) + 'px';
      };
    }
    // 将飞机添加到游戏区
    this.gameRegion.appendChild(img);
    // 飞机移动
    this.airplaneMovement(img);
  }, this.createTime);
};

// 飞机移动
Game.prototype.airplaneMovement = function (img) {
  let y = img.y, h = img.height;
  let time = setInterval(() => {
    y += 5;
    img.style.top = y + 'px';
    if (y >= this.height + (h * 2)) {
      clearInterval(time);
      img.remove();
    }
  }, 1000 / 60)
};

// 生成我方飞机
Game.prototype.ourPlane = function () {
  let div = document.createElement("div"), img = new Image(), that = this;
  img.src = '../img/me.png';
  img.style.display = 'none';
  div.style.position = 'absolute';
  div.style.top = 0;
  div.style.zIndex = '10';
  div.style.backgroundImage = "url(" + img.src + ")";
  div.style.cursor = "cell";
  div.setAttribute('class', 'ourPlane');

  if (img.complete) {
    div.style.width = img.width + 'px';
    div.style.height = img.height + 'px';
    that.me = {x: div.clientX, y: div.clientY, width: img.width, height: img.height};
  } else {
    img.onload = function () {
      img.onload = null;
      div.style.width = img.width + 'px';
      div.style.height = img.height + 'px';
      that.me = {x: div.clientX, y: div.clientY, width: img.width, height: img.height};
    };
  }

  this.gameRegion.appendChild(div);
  div.appendChild(img);
  this.gameRegion.onmousemove = function (e) {
    let x = e.pageX - that.gameRegion.offsetLeft - that.me.width / 2;
    let y = e.pageY - that.gameRegion.offsetTop - that.me.height / 2;
    if (x <= 0) return;
    if (y <= 0) return;
    if (x >= that.width - that.me.width) return;
    if (y >= that.height - that.me.height) return;
    div.style.top = y + 'px';
    div.style.left = x + 'px';
    that.me = {x: x, y: y, width: img.width, height: img.height};
  };
  this.bulletLaunch(div);
};

// 碰撞检测
Game.prototype.collision = function () {
  setInterval(() => {
    let div = document.querySelector('.game .ourPlane');
    let img = document.querySelectorAll('.enemy');
    img.forEach((e, i) => {
      if (div.offsetLeft < e.x + e.width &&
        div.offsetLeft + div.offsetWidth > e.x &&
        div.offsetTop < e.y + e.height &&
        div.offsetHeight + div.offsetTop > e.y) {
        e.remove();
        console.log("碰撞减去判断", i);
      }
    })
  }, 50)
};

// 子弹发射
Game.prototype.bulletLaunch = function (div) {
  let that = this;
  div.onclick = function () {
    let x = parseInt(this.style.left);
    let y = parseInt(this.style.top);
    let bullet = new Image();
    bullet.src = '../img/b.png';
    bullet.style.position = 'absolute';
    bullet.style.top = y + that.me.height + 'px';
    bullet.style.left = (x + that.me.width / 2) + 'px';
    bullet.style.zIndex = 1;
    that.gameRegion.appendChild(bullet);
    that.bulletMovement(bullet);
  };
};
// 子弹移动
Game.prototype.bulletMovement = function (bullet) {
  let y = parseInt(bullet.y) - this.me.height;
  let time = setInterval(() => {
    y -= 5;
    bullet.style.top = y + 'px';
    if (y <= 0) {
      clearInterval(time);
      bullet.remove();
    }
  }, 1000 / 60)
};
