function main() {
  var base_r = 63/2;
  var base_h = 30;
  var base_d = 150-base_r*2; // separation between circle centers
  var shell = 2;
  var inner_r = base_r-shell;
  var top_lip = 1.2;
  var top_h = 8;
  var sides = 5;
  var c = circle(base_r).center(true);
  var base_plate = hull(c,c.translate([base_d,0,0])).center(true);
  var c_i = circle(inner_r).center(true);
  var inner_plate = hull(c_i,c_i.translate([base_d,0,0])).center(true);
  var base  = difference(
    linear_extrude({height: base_h},base_plate),
    linear_extrude({height: base_h},inner_plate).translate([0,0,shell])
  );
  /*var r = 1;
  var h = base_d/base_r;
  var top  = cylinder({r: r, h: h, round: true}).rotateY(90).center(true).translate([0,0,-r*Math.sqrt(0.75)]);
  top = difference(top,cube(200).center(true).translate([0,0,-100]));
  var top_r = base_r + 2*top_lip;
  var top_d = base_r*2
  top = top.scale([top_d,top_r,top_r]);
  top = difference(top,cube(200).center(true).translate([0,0,100+top_h]));
  */
  var top_plate = linear_extrude({height: 1},base_plate).scale([top_lip,top_lip,1]);
  var top = [top_plate];
  for (var i=1;i<top_h;i++) {
    drop = (top_h-i)/top_h;
    top.push(top_plate.scale([drop,drop,0.5]).translate([0,0,0.5+i/2]));
  }
  top = union(top);

  var c = circle(base_r+shell/2).center(true);
  var base_plate = hull(c,c.translate([base_d,0,0])).center(true);
  var c_i = circle(inner_r-shell/2).center(true);
  var inner_plate = hull(c_i,c_i.translate([base_d,0,0])).center(true);
  var cutout  = difference(
    linear_extrude({height: shell/2},base_plate),
    linear_extrude({height: shell/2},inner_plate)
  );
  top = difference(top,cutout);
  return [top,base.translate([0,base_r*2.5,0]),top];
}
