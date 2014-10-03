function getParameterDefinitions() {
  return [
    { name: 'd', type: 'float', initial: 4, caption: "Square Width/Height" },
    { name: 'ri', type: 'float', initial: 1, caption: "Square Parimeter Thickness" },
    { name: 'n_x', type: 'float', initial: 3, caption: "Number X" },
    { name: 'n_y', type: 'float', initial: 5, caption: "Number Y" }
    /*{ name: 'hex_h', type: 'float', initial: 5, caption: "Hex Thickness" },
    { name: 'tri_ro', type: 'float', initial: 12, caption: "Triangle Outer Radius" },
    { name: 'tri_ri', type: 'float', initial: 3.5, caption: "Triangle Inner Radius" },
    { name: 'gap', type: 'float', initial: 0.6, caption: "Gap" },
    { name: 'pattern', type: 'custom', constructor: newCanvas, caption: "pattern"}*/
  ];
}

function main(p) {
  p.ro2 = p.d/2;
  p.ro = 2*p.ro2/Math.sqrt(2);
  var unit = rotate_extrude({fn:4,ro: p.ro}, square({size: [p.ri,p.ri], center: true})/*.rotateZ(45)*/.translate([p.ro,0,0]) );
  var _h = Math.sqrt(2)*p.ro2;
  unit = unit.rotateZ(45).rotateX(45);
  var cut = cube({size:[_h*2,_h*2,_h],center:true});
  unit = difference(
    unit,
    cut.translate([0,0,-_h]),
    cut.translate([0,0,_h])
  );
  mirrored = unit.mirroredY();
  cut = cube([p.ri*0.2,_h*4,_h]).center(true).translate([0,0,_h/2]);
  cut_u = difference(unit,cut);
  cut_m = difference(mirrored,cut);
  _b = unit.getBounds();
  var width = _b[1].x-_b[0].x;
  var depth = _b[1].y-_b[0].y;
  var height = _b[1].z-_b[0].z;
  out = [];
  //return [unit,cut];
  for (var i=0; i<p.n_x; i++) {
    for (var j=0; j<p.n_y*2; j++) {
      dx = (j%2 == 1)?0:width*0.6;
      dy = -j%2 * depth/3;
      u = (j%2 == 1)?unit:mirrored;
      if (j == p.n_y*2-1) { u = cut_u }
      if (i == p.n_x-1 && j%2 == 0) { u = cut_m }
      t = [i*width*1.2+dx,Math.floor(j/2)*depth*0.7+dy,0];
      out.push(u.translate(t).translate([-p.n_x*width/2,-p.n_y*depth/2,0]));
    }
  }
  return out;
}
