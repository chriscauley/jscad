function main() {
  var tz = 0.2;
  var th = 0.8;
  var rc = 1;
  var r = 5/2;
  var h = 1;
  var petals = 12;
  var l = 30;
  var floors = 20;
  var z_scale = 0;
  //var ci = linear_extrude({height:t},circle(rc)).center(true);
  //var co = linear_extrude({height:t},circle(rc+t)).center(true);
  //var ring = difference([co,ci]).scale([1,l,1]).translate([0,l*rc,h]);
  var _line = cube([th,l+1,tz]).center([true,false,true]);
  var ring = union([_line.rotateZ(0.5).translate([-th/2,0,0]),_line.rotateZ(-0.5).translate([th/2,0,0])]);
  //ring = _line.translate([0,-l,0]);
  var peg = linear_extrude({height:h+floors*tz*2},circle(r).center(true));
  out = [];
  for (var i=0;i<petals;i++) { out.push(ring.rotateZ(i*360/petals)); }
  var level = union(out);
  out = [];
  for (var i=0;i<floors;i++) {
    out.push(level.rotateZ(i*90/petals).scale(1-i*z_scale/floors).translate([0,0,tz*i*2+h]));
  }
  out.push(peg);
  support = difference(
    linear_extrude({height: h-tz},circle(l*0.85).center(true)),
    linear_extrude({height: h-tz},circle(l*0.85-th).center(true))
  )
  out.push(support);
  return union(out);
}
