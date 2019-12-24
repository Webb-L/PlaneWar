alert("如果屏幕大小改变了，请刷新网页！");
const start = document.querySelector('.start');
// 开始按钮注册点击事件
start.onclick = function (e) {
  this.style.display = 'none';
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

  // 定时器
  this.TimingInterval;
  this.OurEnemyPlaneCollidedTime;
  this.BulletEnemyCollisionTime;
  this.randomPlaneTime;

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

  // 游戏是否结束
  this.gameOverFlag = false;

  this.timing();
  this.randomPlane();
  this.ourPlane();
  this.collision();
};

// 计时器
Game.prototype.timing = function () {
  let second = 1;
  this.TimingInterval = setInterval(() => {
    this.time.innerText = second++;
  }, 1000)
};

// 随机生成敌方飞机
Game.prototype.randomPlane = function () {
  let that = this;
  // 创建飞机
  this.randomPlaneTime = setInterval(() => {
    let img = new Image();
    let type = Math.floor(Math.random() * (4 - 1) + 1);
    img.src = '../img/e' + type + '.png';
    img.setAttribute('data-type', type);
    img.setAttribute('class', 'enemy');
    img.style.cssText = `position:absolute; border:1px solid red; top:-80px`;
    if (img.complete) {
      img.style.left = Math.floor(Math.random() * (that.width - img.width)) + 'px';
      img.style.width = img.width + 'px';
      img.style.height = img.height + 'px';
    } else {
      img.onload = function () {
        img.onload = null;
        img.style.left = Math.floor(Math.random() * (that.width - img.width)) + 'px';
        img.style.width = img.width + 'px';
        img.style.height = img.height + 'px';
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
      switch (img.getAttribute('data-type')) {
        case '1':
          this.fraction.innerText = parseInt(this.fraction.innerText) - (parseInt(img.getAttribute('data-type')) * 10) * 5;
          this.gameOver();
          break;
        case '2':
          this.fraction.innerText = parseInt(this.fraction.innerText) - (parseInt(img.getAttribute('data-type')) * 10) * 5;
          this.gameOver();
          break;
        case '3':
          this.fraction.innerText = parseInt(this.fraction.innerText) - (parseInt(img.getAttribute('data-type')) * 10) * 5;
          this.gameOver();
          break;
      }
      img.remove();
    }
  }, 1000 / 60)
};

// 生成我方飞机
Game.prototype.ourPlane = function () {
  let div = document.createElement("div"), img = new Image(), that = this;
  img.src = '../img/me.png';
  img.style.display = 'none';
  div.style.cssText = `position:absolute; top:0; zIndex:10; background-image:url('${img.src}'); cursor:cell; border: 1px solid blue;`;
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
  // 我方飞机和敌方飞机碰撞
  this.OurEnemyPlaneCollidedTime = setInterval(() => {
    let img = document.querySelectorAll('.enemy');
    img.forEach(e => {
      if (this.me.x < parseInt(e.style.left) + e.width &&
        this.me.x + this.me.width > parseInt(e.style.left) &&
        this.me.y < parseInt(e.style.top) + e.height &&
        this.me.height + this.me.y > parseInt(e.style.top)) {
        e.remove();
        e.setAttribute('data-type', '0');
        this.fraction.innerText = -9999;
        this.gameOver();
      }
    })
  }, 50);

  // 子弹和敌方飞机碰撞
  this.BulletEnemyCollisionTime = setInterval(() => {
    let img = document.querySelectorAll('.enemy');
    let bullet = document.querySelectorAll('.bullet');
    img.forEach(e => {
      bullet.forEach(eve => {
        if (parseInt(e.style.left) < parseInt(eve.style.left) + eve.width &&
          parseInt(e.style.left) + e.width > parseInt(eve.style.left) &&
          parseInt(e.style.top) < parseInt(eve.style.top) + eve.height &&
          e.height + parseInt(e.style.top) > parseInt(eve.style.top)) {
          e.src = '../img/boom.gif';
          switch (e.getAttribute('data-type')) {
            case '1':
              this.fraction.innerText = parseInt(this.fraction.innerText) + parseInt(e.getAttribute('data-type')) * 10;
              eve.remove();
              break;
            case '2':
              this.fraction.innerText = parseInt(this.fraction.innerText) + parseInt(e.getAttribute('data-type')) * 10;
              eve.remove();
              break;
            case '3':
              this.fraction.innerText = parseInt(this.fraction.innerText) + parseInt(e.getAttribute('data-type')) * 10;
              eve.remove();
              break;
          }
          e.setAttribute('data-type', '0');
          if (this.fraction.innerText >= 500) this.fraction.innerText = 0;
          let num = 1;
          let disappear = setInterval(() => {
            num = num - 0.05;
            e.style.opacity = num;
            if (num <= 0) clearInterval(disappear);
          }, 1000 / 60);
        }
      });
    });
  }, 50);
};

// 子弹发射
Game.prototype.bulletLaunch = function (div) {
  let that = this;
  div.onclick = function () {
    let x = parseInt(this.style.left);
    let y = parseInt(this.style.top);
    let bullet = new Image();
    bullet.src = '../img/b.png';
    bullet.style.cssText = `position:absolute; top:${y + that.me.height}px; left:${x + that.me.width / 2}px; zIndex:1; border:1px solid yellow;`;
    // bullet.style.position = 'absolute';
    // bullet.style.top = y + that.me.height + 'px';
    // bullet.style.left = (x + that.me.width / 2) + 'px';
    // bullet.style.zIndex = 1;
    // bullet.style.border = "1px solid yellow";
    bullet.setAttribute('class', 'bullet');
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
// 游戏结束
Game.prototype.gameOver = function () {
  if (this.gameOverFlag) return;
  this.gameOverFlag = true;


  if (this.fraction.innerText <= 0) {
    let popup = document.querySelector('.popup');
    popup.style.display = 'flex';
    document.querySelector('.popup .endTime').innerText = this.time.innerText;
    // 判断段位
    if (this.time.innerText <= 30) {
      document.querySelector('.popup .rank').innerText = "倔强青铜";
    } else if (30 < this.time.innerText && this.time.innerText <= 60) {
      document.querySelector('.popup .rank').innerText = "秩序白银";
    } else if (60 < this.time.innerText && this.time.innerText <= 120) {
      document.querySelector('.popup .rank').innerText = "荣耀黄金";
    } else if (120 < this.time.innerText && this.time.innerText <= 240) {
      document.querySelector('.popup .rank').innerText = "尊贵铂金";
    } else if (240 < this.time.innerText && this.time.innerText <= 480) {
      document.querySelector('.popup .rank').innerText = "永恒钻石";
    } else if (this.time.innerText > 480) {
      document.querySelector('.popup .rank').innerText = "最强王者";
    }

    if (document.querySelector('.ourPlane')) document.querySelector('.ourPlane').remove();
    document.querySelectorAll('.bullet').forEach(e => {
      e.remove();
    });
    document.querySelectorAll('.enemy').forEach(e => {
      e.setAttribute('data-type', '0');
      e.remove();
    });
    clearInterval(this.TimingInterval);
    clearInterval(this.OurEnemyPlaneCollidedTime);
    clearInterval(this.BulletEnemyCollisionTime);
    clearInterval(this.randomPlaneTime);
    let comeAgain = document.querySelector('.comeAgain');
    comeAgain.onclick = () => {
      if (this.gameOverFlag) {
        document.querySelector('.popup').style.display = 'none';
        this.time.innerText = 0;
        this.fraction.innerText = '0';
        this.gameOverFlag = false;
        popup.style.display = 'none';
        start.style.display = 'flex';
      }
    };
  }
};
