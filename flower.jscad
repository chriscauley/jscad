function main() {
  var tz = 0.3;
  var th = 0.8;
  var rc = 1;
  var r = 5/2;
  var h = 1;
  var petals = 30;
  var l = 15;
  var floors = 15;
  var stem_shell = 3;
  var stem_h = 50;
  var stem = false;
  var scale_min = 2;
  var center_r = 5;
  if (stem) {
    return difference(
      linear_extrude({height:stem_h},circle(r+stem_shell).center(true)),
      linear_extrude({height:h},circle(r+th).center(true)).translate([0,0,stem_h-h])
    );
  }
  //var ci = linear_extrude({height:t},circle(rc)).center(true);
  //var co = linear_extrude({height:t},circle(rc+t)).center(true);
  //var ring = difference([co,ci]).scale([1,l,1]).translate([0,l*rc,h]);
  var center_h = Math.max(center_r/2,floors*tz*2);
  var center = union(
    sphere(center_r).center(true).scale([1,1,0.5]),
    linear_extrude({height:center_h},circle(center_r)).center([true,true,false])
  ).translate([0,0,center_r/2]);
  center = difference(
    center,
    cube([10,10,1]).center(true)
  );
  var _line = cube([th,l+1+center_r,tz]).center([true,false,true]);
  var ring = union([_line.rotateZ(0.5).translate([-th/2,0,0]),_line.rotateZ(-0.5).translate([th/2,0,0])]);
  //ring = _line.translate([0,-l,0]);
  var peg = linear_extrude({height:h},circle(r).center(true)).translate([0,0,center_h+center_r/2]);
  out = [];
  for (var i=0;i<petals;i++) { out.push(ring.rotateZ(i*360/petals)); }
  var level = union(out);
  out = [];
  for (i=1;i<floors+1;i++) {
    var _scale = i/floors*(l-scale_min)+scale_min;
    out.push(level.rotateZ(i*90/petals).scale(_scale/l).translate([0,0,center_r/2+tz*(i-1)*2]));
  }
  out.push(peg);
  out.push(center);
  support = difference(
    linear_extrude({height: center_r/2-tz},circle(center_r+scale_min*0.85).center(true)),
    linear_extrude({height: center_r/2-tz},circle(center_r+scale_min*0.85-th).center(true))
  );
  //out.push(support);
  return out;
}
