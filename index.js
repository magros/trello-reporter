'use strict';

const report = require('./reporter');

let empleosti = 'A78qbjK8';
let cratos = 'KQsf66NY';
let hireline = 'R9dmoDTl';
let seo = 'VkxRRjUV';

let date = '01 al 05 Junio 2019';

report(seo
  , `Puntos sprint SEO - ${date}`
  , true);

report(hireline
  , `Puntos sprint Hireline - ${date}`
  , true);

report(cratos
  , `Puntos sprint Cratos - ${date}`
  , true);

report(empleosti
  , `Puntos sprint EmpleosTI - ${date}`
  , true);