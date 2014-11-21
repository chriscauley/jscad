function main() {
  var h = 10;
  var ri = 14.5/2;
  var shell = 4;
  var ro = ri + shell;
  var plank_l = 40;
  var ball_r = 2.7;
  var plank_h = 8;
  var plank = cube([ro,ro,plank_h]).center(true).translate([plank_l-5,0,plank_h/2]);
  cutout = linear_extrude({height:20},circle(ball_r)).center(true).rotateY(90).translate([plank_l-10,0,plank_h-ball_r-0.3]);
  plank = union(
    plank,
    cube([plank_l,ro,shell]).center([false,true,false]),
    linear_extrude({height:2},circle(ri)).center(true).rotateY(90).translate([plank_l,0,ri])
  );
  plank = difference(
    plank,
    cutout
  );
  var outer = hull(circle(ro).center(true),square([ro,ro*2]).center(true).translate([ro/2,0]));
  var cyl = difference(
    linear_extrude({height:h},outer),
    linear_extrude({height:h},circle(ri).center(true))
  );
  var brace_r = 5;
  var brace_d = 15;
  var c = circle(brace_r).center(true);
  var brace = hull(
    c.translate([0,brace_d,0]),
    c.translate([0,-brace_d,0])
  );
  brace = linear_extrude({height:2},brace);
  var hole = circle(2).center(true);
  hole = linear_extrude({height:2},hole);
  brace = difference(
    brace,
    hole.translate([0,brace_d,0]),
    hole.translate([0,-brace_d,0])
  );
  return union(
    brace,
    plank,
    cyl.rotateY(90).translate([-h/2,0,ro])
  ).rotateY(-90);
}
