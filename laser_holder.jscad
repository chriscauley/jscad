function main() {
  var h = 10;
  var ri = 13/2;
  var shell = 4;
  var ro = ri + shell;
  var outer = hull(circle(ro).center(true),square([ro,ro*2]).center(true).translate([ro/2,0]));
  var cyl = difference(
    linear_extrude({height:h},outer),
    linear_extrude({height:h},circle(ri).center(true))
  )
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
  )
  return union(
    cyl.rotateY(90).translate([-h/2,0,ro]),
    brace
  );
}
