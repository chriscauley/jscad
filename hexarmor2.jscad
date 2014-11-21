_d = {
  clamp: {fn:6},
  tri: {fno:3}
};
function getParameterDefinitions() {
  return [
    { name: 'clamp_l', type: 'float', initial: 15, caption: "Clamp Length" },
    { name: 'clamp_w', type: 'float', initial: 5, caption: "Clamp Width" },
    { name: 'tri_ro', type: 'float', initial: 12, caption: "Triangle Outer Radius" },
    { name: 'tri_ri', type: 'float', initial: 3.5, caption: "Triangle Inner Radius" },
    { name: 'tri', type: 'choice', values: [3,4,5], caption: "Number of Sides" },
    { name: 'gap', type: 'float', initial: 0.6, caption: "Gap" },
    { name: 'pattern', type: 'custom', constructor: window.newCanvas, caption: "pattern"}
  ];
}

function torus3(p) {
  var ri = 1, ro = 4, fni = 16, fno = 32;
  var p = p || {}
  if(p.ri) ri = p.ri;
  if(p.fni) fni = p.fni;
  if(p.ro) ro = p.ro;
  if(p.fno) fno = p.fno;
  if(fni<3) fni = 3;
  if(fno<3) fno = 3;
  var c = circle({r:ri,fn:fni,center:true});
  var ro2 = ro*sin(180/fno);
  var rod = linear_extrude({height: ro*4},c).rotateY(90).center(true).translate([0,ro2,0]);
  var cut = cube([3*ro,2*ro,2*ri]).center(true).translate([0,-ro,0]);
  var cut1 = cut.translate([ro,0,0]).rotateZ(90-180/fno);
  var cut2 = cut.translate([-ro,0,0]).rotateZ(-90+180/fno);
  rod = difference(rod,cut1,cut2);
  out = [rod];
  for (var i=1;i<fno;i++) { out.push(rod.rotateZ(i*360/fno)); }
  return union(out).rotateZ(90); //this is a hack to get the triangle oriented the same as everything else
}

function generate_link(_d) {
  var c = circle(_d.tri.ri).center(true);
  var offset = _d.clamp.l/2;
  var link = hull(c.translate([offset,0,0]),c.translate([-offset,0,0]));
  link = linear_extrude({height:_d.clamp.w},link).rotateX(90).center(true);
  return difference(link,cube(offset*2).center(true).translate([-offset,0,0]));
}

function get_unit_cell(_d) {
  var tri = torus3(_d.tri);
  var theta = {3:60,4:45,5:36}[_d.tri.fno]
  var tri_r2 = _d.tri.ro*sin(theta); //distance to center of clamp
  var tri_cut = linear_extrude({height:_d.clamp.w+_d.gap},circle(_d.tri.ri));
  tri_cut = tri_cut.rotateX(90).center(true).translate([-tri_r2,0,0]);
  var _u = [tri];
  for (var i=0;i<_d.tri.fno;i++) {
    _u.push(tri_cut.rotateZ(i*360/_d.tri.fno))
  }
  tri = difference(_u);
  _d.tri_inner = {ri:_d.tri.ri,ro:_d.tri.ro,fno:_d.tri.fno};
  var clamp_thickness = 1;
  _d.tri_inner.ri = _d.tri.ri - clamp_thickness/2 - _d.gap;
  tri = union(tri,torus3(_d.tri_inner));
  
  var c = linear_extrude({height:_d.clamp.w+_d.gap},circle(_d.tri.ri-clamp_thickness+_d.gap/2)).center(true);
  var clamp_hole = c.rotateX(90).center(true).translate([-tri_r2,0,0]);
  var join = generate_link(_d).translate([-tri_r2-_d.clamp.l/2,0,0]);
  var half_join = difference(
    join,
    clamp_hole //round hole
  );
  _u = [tri]
  for (var i=0;i<_d.tri.fno;i++) {
    _u.push(half_join.rotateZ(i*360/_d.tri.fno))
  }
  var unit_cell = union(_u);
  return unit_cell.center(true).translate([_d.clamp.l/2-_d.tri.ri,0,0]);
}

function main(p) {
  var start = new Date().valueOf();
  _d.clamp.l = p.clamp_l;
  _d.clamp.w = p.clamp_w;
  _d.tri.ri = p.tri_ri;
  _d.tri.ro = p.tri_ro;
  _d.tri.fno = parseInt(p.tri);
  _d.gap = p.gap;
  var unit_cell = get_unit_cell(_d);
  return difference(unit_cell,cube(100).center(true).translate([0,50,0]));
  var bounds = unit_cell.getBounds();
  rt = _d.tri.ro+_d.tri.ri
  _d.dx = 2*cos(30)*rt;
  _d.dy = 2*(rt+sin(30)*rt)+6;
  var y_shift = _d.tri.ro+3;
  var from_pattern = [];
  for (var row=0; row<p.pattern.length; row++) {
    for (var col=0; col<p.pattern[row].length; col++) {
      if (p.pattern[row][col] == 0) { continue; }
      t = unit_cell;
      if (p.pattern[row][col] == -1) { t = t.rotateZ(180).translate([y_shift,0,0]); } // this translate is bs'd
      t = t.translate([(row-3)*_d.dy,(col-2)*_d.dx,0]);
      from_pattern.push(t);
    }
  }
  from_pattern = union(from_pattern);
  console.log("Completed in "+(new Date().valueOf()-start)/1000+" seconds");
  return from_pattern;
}
