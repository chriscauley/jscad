function getParameterDefinitions() {
  return [
    { name: 'base_x', type: 'float', initial: 60, caption: "Base X" },
    { name: 'base_y', type: 'float', initial: 70, caption: "Base Y" },
    { name: 'base_z', type: 'float', initial: 3, caption: "Base Z" },
    { name: 'rod_r', type: 'float', initial: 10, caption: "Rod Radius" },
    { name: 'rod_z', type: 'float', initial: 85, caption: "Rod Z" },
    { name: 'hole_r', type: 'float', initial: 3, caption: "Screw Hole Radius" },
    { name: 'hole_r2', type: 'float', initial: 2, caption: "Screw Hole Inner Radius" },
    { name: 'hole_d', type: 'float', initial: 41, caption: "Screw Separation" },
    { name: 'peg_r', type: 'float', initial: 20, caption: "Peg Radius" },
    { name: 'peg_z', type: 'float', initial: 5, caption: "Peg Thickness" },
    { name: 'bisect', type: 'choice', values: ['yes','no'], caption: 'Print flat/half' }
  ];
}

function main(p) {
  var base = cube([p.base_x,p.base_y,p.base_z]).center(true);
  var c = circle(p.hole_r);
  c = hull(c.translate([0,-p.hole_r/2,0]),c.translate([0,p.hole_r/2,0])).center(true);
  var c2 = circle(p.hole_r2);
  c2 = hull(c2.translate([0,-p.hole_r2/2,0]),c2.translate([0,p.hole_r2/2,0])).center(true);
  var screw_hole = linear_extrude({height:p.base_z},c).center(true);
  var screw_hole2 = linear_extrude({height:p.base_z},c2).center(true);
  //return [base,screw_hole.translate([0,0,1]),screw_hole2.translate([0,0,2])];
  base = difference(
    base,
    screw_hole.translate([0,-p.hole_d/2,p.base_z/2]),
    screw_hole.translate([0,p.hole_d/2,p.base_z/2]),
    screw_hole2.translate([0,-p.hole_d/2,0]),
    screw_hole2.translate([0,p.hole_d/2,0])
  )
  var rod = linear_extrude({ height: p.rod_z }, circle(p.rod_r)).center(true);
  var peg = CSG.cylinder({
    start: [0, 0, 0],
    end: [0, 0, p.peg_z],
    radiusStart: p.peg_r,
    radiusEnd: p.rod_r,
    resolution: 16
  }).center(true).rotateY(180);
  var out = union(
    base,
    rod.translate([0,0,p.rod_z/2+p.base_z/2]),
    peg.translate([0,0,p.rod_z+p.base_z/2+p.peg_z/2])
  );
  if (p.bisect == 'no') { return out; }
  return difference(
    out,
    cube([1000,1000,1000]).translate([-500,0,-500])
  ).rotateX(-90);
}
