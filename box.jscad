function main() {
  var base_w = 63;
  var base_h = 30;
  var shell = 2;
  var inner_w = base_w-2*shell;
  var top_r1 = 70;
  var top_r2 = base_w/2;
  var top_h = 4;
  var sides = 5;
  var base = difference(
    cube([base_w,base_w,base_h]).center(true),
    cube([inner_w,inner_w,base_h]).center(true).translate([0,0,shell])
  ).translate([base_w,0,base_h/2]);
  var top = CSG.cylinder({
    start: [0, 0, 0],
    end: [0, 0, top_h],
    radiusStart: top_r1,
    radiusEnd: top_r2,
    resolution: sides
  }).center(true);
  if (sides%2 == 0) { top = top.rotateZ(45); }
  var s = shell/2;
  var cutout = difference(
    cube([base_w+s,base_w+s,s]).center(true),
    cube([inner_w-s,inner_w-s,s]).center(true)
  ).translate([0,0,-top_h/2]);
  top = difference(
    top,
    cutout
  );
  top = top.translate([-top_r2,0,top_h/2]);
  return [base, top]
}
