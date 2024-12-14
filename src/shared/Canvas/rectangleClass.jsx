export class BoxRectangle {
  constructor(id, ctx, color, x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.ctx = ctx;
    this.id = id;
  }

  getId() {
    return this.id;
  }

  // draw() {
  //   this.ctx.fillStyle = this.color;
  //   this.ctx.fillRect(this.x, this.y, this.w, this.h);
  // }

  update(x,y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  setColor(color) {
    this.color = color;
  }

  getColor() {
    return this.color;
  }

  getY() {
    return this.y;
  }
  getX() {
    return this.x;
  }
  getH() {
    return this.h;
  }
  getW() {
    return this.w;
  }

  getBounce() {
    return JSON.parse(
      JSON.stringify({
        id: this.id,
        x: this.x,
        y: this.y,
        w: this.w,
        h: this.h,
      })
    );
  }

  clearSelf() {
    this.ctx.clearRect(this.x, this.y, this.w, this.h);
  }

  collision(box2) {

    const width1 = (this.x + this.w) 
    const height1 = (this.y + this.h) 
    
    const width2 = box2?.getX() + box2?.getW();
    const height2 = box2?.getY() + box2?.getH();

    return (
      width1 >= box2?.getX() &&
      width2 >= this.x &&
      height1 >= box2?.getY() &&
      height2 >= this.y
    );
  }
}
