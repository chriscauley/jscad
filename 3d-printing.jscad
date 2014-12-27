function main() {
  var r = 50;
  var w = r*2;
  var squash = 0.15;
  var h = r*squash*2;
  var shift = r;
  var up = 0;
  var s = sphere(r).center(true).scale([1,1,squash]);
  var box = difference([
    cube([w,w,h]).center(true),
    //s.translate([shift,0,up]),
    s.translate([-shift,0,up]),
    //s.translate([0,shift,up]),
    s.translate([0,-shift,up])
  ]).translate([0,0,h/2]);
  return difference([
    box,
    cube([w,w,h]).center(true).translate([0,0,h]),
    cube([w,w,h]).center(true).translate([0,w/2,0]),
    cube([w,w,h]).center(true).translate([w/2,0,0])
  ]);
}
