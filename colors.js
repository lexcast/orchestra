/*
	----------------------------------------------------
	Color Space : 1.2 : 2012.11.06
	----------------------------------------------------
	https://github.com/mudcube/Color.Space.js
	----------------------------------------------------
	RGBA <-> HSLA  <-> W3
	RGBA <-> HSVA
	RGBA <-> CMY   <-> CMYK
	RGBA <-> HEX24 <-> W3
	RGBA <-> HEX32
	RGBA <-> W3
	----------------------------------------------------
	Examples
	----------------------------------------------------
	Color.Space(0x99ff0000, "HEX32>RGBA>HSLA>W3"); // outputs "hsla(60,100%,17%,0.6)"
	Color.Space(0xFF0000, "HEX24>RGB>HSL"); // convert hex24 to HSL object.
	----------------------------------------------------
	W3 values
	----------------------------------------------------
	rgb(255,0,0)
	rgba(255,0,0,1)
	rgb(100%,0%,0%)
	rgba(100%,0%,0%,1)
	hsl(120, 100%, 50%)
	hsla(120, 100%, 50%, 1)
	#000000
*/

if (typeof Color === "undefined") var Color = {};
if (typeof Color.Space === "undefined") Color.Space = {};

(function () {
  "use strict";

  var useEval = false; // caches functions for quicker access.

  var functions = {
    // holds generated cached conversion functions.
  };

  var shortcuts = {
    "HEX24>HSL": "HEX24>RGB>HSL",
    "HEX32>HSLA": "HEX32>RGBA>HSLA",
    "HEX24>CMYK": "HEX24>RGB>CMY>CMYK",
    "RGB>CMYK": "RGB>CMY>CMYK",
  };

  var root = (Color.Space = function (color, route) {
    if (shortcuts[route]) {
      // shortcut available
      route = shortcuts[route];
    }
    var r = route.split(">");
    // check whether color is an [], if so, convert to {}
    if (typeof color === "object" && color[0] >= 0) {
      // array
      var type = r[0];
      var tmp = {};
      for (var i = 0; i < type.length; i++) {
        var str = type.substr(i, 1);
        tmp[str] = color[i];
      }
      color = tmp;
    }
    if (functions[route]) {
      // cached function available
      return functions[route](color);
    }
    var f = "color";
    for (var pos = 1, key = r[0]; pos < r.length; pos++) {
      if (pos > 1) {
        // recycle previous
        key = key.substr(key.indexOf("_") + 1);
      }
      key += (pos === 0 ? "" : "_") + r[pos];
      color = root[key](color);
      if (useEval) {
        f = "Color.Space." + key + "(" + f + ")";
      }
    }
    if (useEval) {
      functions[route] = eval("(function(color) { return " + f + " })");
    }
    return color;
  });

  // W3C - RGB + RGBA

  root.RGB_W3 = function (o) {
    return "rgb(" + (o.R >> 0) + "," + (o.G >> 0) + "," + (o.B >> 0) + ")";
  };

  root.RGBA_W3 = function (o) {
    var alpha = typeof o.A === "number" ? o.A / 255 : 1;
    return (
      "rgba(" +
      (o.R >> 0) +
      "," +
      (o.G >> 0) +
      "," +
      (o.B >> 0) +
      "," +
      alpha +
      ")"
    );
  };

  root.W3_RGB = function (o) {
    o = o.substr(4, o.length - 5).split(",");
    return {
      R: parseInt(o[0], 10),
      G: parseInt(o[1], 10),
      B: parseInt(o[2], 10),
    };
  };

  root.W3_RGBA = function (o) {
    o = o.substr(5, o.length - 6).split(",");
    return {
      R: parseInt(o[0], 10),
      G: parseInt(o[1], 10),
      B: parseInt(o[2], 10),
      A: parseFloat(o[3]) * 255,
    };
  };

  // W3C - HSL + HSLA

  root.HSL_W3 = function (o) {
    return (
      "hsl(" +
      ((o.H + 0.5) >> 0) +
      "," +
      ((o.S + 0.5) >> 0) +
      "%," +
      ((o.L + 0.5) >> 0) +
      "%)"
    );
  };

  root.HSLA_W3 = function (o) {
    var alpha = typeof o.A === "number" ? o.A / 255 : 1;
    return (
      "hsla(" +
      ((o.H + 0.5) >> 0) +
      "," +
      ((o.S + 0.5) >> 0) +
      "%," +
      ((o.L + 0.5) >> 0) +
      "%," +
      alpha +
      ")"
    );
  };

  root.W3_HSL = function (o) {
    var start = o.indexOf("(") + 1;
    var end = o.indexOf(")");
    o = o.substr(start, end - start).split(",");
    return {
      H: parseInt(o[0], 10),
      S: parseInt(o[1], 10),
      L: parseInt(o[2], 10),
    };
  };

  root.W3_HSLA = function (o) {
    var start = o.indexOf("(") + 1;
    var end = o.indexOf(")");
    o = o.substr(start, end - start).split(",");
    return {
      H: parseInt(o[0], 10),
      S: parseInt(o[1], 10),
      L: parseInt(o[2], 10),
      A: parseFloat(o[3], 10) * 255,
    };
  };

  // W3 HEX = "FFFFFF" | "FFFFFFFF"

  root.W3_HEX = root.W3_HEX24 = function (o) {
    if (o.substr(0, 1) === "#") o = o.substr(1);
    if (o.length === 3) o = o[0] + o[0] + o[1] + o[1] + o[2] + o[2];
    return parseInt("0x" + o, 16);
  };

  root.W3_HEX32 = function (o) {
    if (o.substr(0, 1) === "#") o = o.substr(1);
    if (o.length === 6) {
      return parseInt("0xFF" + o, 10);
    } else {
      return parseInt("0x" + o, 16);
    }
  };

  // HEX = 0x000000 -> 0xFFFFFF

  root.HEX_W3 = root.HEX24_W3 = function (o, maxLength) {
    if (!maxLength) maxLength = 6;
    if (!o) o = 0;
    var n;
    var z = o.toString(16);
    // when string is lesser than maxLength
    n = z.length;
    while (n < maxLength) {
      z = "0" + z;
      n++;
    }
    // when string is greater than maxLength
    n = z.length;
    while (n > maxLength) {
      z = z.substr(1);
      n--;
    }
    return "#" + z;
  };

  root.HEX32_W3 = function (o) {
    return root.HEX_W3(o, 8);
  };

  root.HEX_RGB = root.HEX24_RGB = function (o) {
    return {
      R: o >> 16,
      G: (o >> 8) & 0xff,
      B: o & 0xff,
    };
  };

  // HEX32 = 0x00000000 -> 0xFFFFFFFF

  root.HEX32_RGBA = function (o) {
    return {
      R: (o >>> 16) & 0xff,
      G: (o >>> 8) & 0xff,
      B: o & 0xff,
      A: o >>> 24,
    };
  };

  // RGBA = R: Red / G: Green / B: Blue / A: Alpha

  root.RGBA_HEX32 = function (o) {
    return ((o.A << 24) | (o.R << 16) | (o.G << 8) | o.B) >>> 0;
  };

  // RGB = R: Red / G: Green / B: Blue

  root.RGB_HEX24 = root.RGB_HEX = function (o) {
    if (o.R < 0) o.R = 0;
    if (o.G < 0) o.G = 0;
    if (o.B < 0) o.B = 0;
    if (o.R > 255) o.R = 255;
    if (o.G > 255) o.G = 255;
    if (o.B > 255) o.B = 255;
    return (o.R << 16) | (o.G << 8) | o.B;
  };

  root.RGB_CMY = function (o) {
    return {
      C: 1 - o.R / 255,
      M: 1 - o.G / 255,
      Y: 1 - o.B / 255,
    };
  };

  root.RGBA_HSLA = root.RGB_HSL = function (o) {
    // RGB from 0 to 1
    var _R = o.R / 255,
      _G = o.G / 255,
      _B = o.B / 255,
      min = Math.min(_R, _G, _B),
      max = Math.max(_R, _G, _B),
      D = max - min,
      H,
      S,
      L = (max + min) / 2;
    if (D === 0) {
      // No chroma
      H = 0;
      S = 0;
    } else {
      // Chromatic data
      if (L < 0.5) S = D / (max + min);
      else S = D / (2 - max - min);
      var DR = ((max - _R) / 6 + D / 2) / D;
      var DG = ((max - _G) / 6 + D / 2) / D;
      var DB = ((max - _B) / 6 + D / 2) / D;
      if (_R === max) H = DB - DG;
      else if (_G === max) H = 1 / 3 + DR - DB;
      else if (_B === max) H = 2 / 3 + DG - DR;
      if (H < 0) H += 1;
      if (H > 1) H -= 1;
    }
    return {
      H: H * 360,
      S: S * 100,
      L: L * 100,
      A: o.A,
    };
  };

  root.RGBA_HSVA = root.RGB_HSV = function (o) {
    //- RGB from 0 to 255
    var _R = o.R / 255,
      _G = o.G / 255,
      _B = o.B / 255,
      min = Math.min(_R, _G, _B),
      max = Math.max(_R, _G, _B),
      D = max - min,
      H,
      S,
      V = max;
    if (D === 0) {
      // No chroma
      H = 0;
      S = 0;
    } else {
      // Chromatic data
      S = D / max;
      var DR = ((max - _R) / 6 + D / 2) / D;
      var DG = ((max - _G) / 6 + D / 2) / D;
      var DB = ((max - _B) / 6 + D / 2) / D;
      if (_R === max) H = DB - DG;
      else if (_G === max) H = 1 / 3 + DR - DB;
      else if (_B === max) H = 2 / 3 + DG - DR;
      if (H < 0) H += 1;
      if (H > 1) H -= 1;
    }
    return {
      H: H * 360,
      S: S * 100,
      V: V * 100,
      A: o.A,
    };
  };

  // CMY = C: Cyan / M: Magenta / Y: Yellow

  root.CMY_RGB = function (o) {
    return {
      R: Math.max(0, (1 - o.C) * 255),
      G: Math.max(0, (1 - o.M) * 255),
      B: Math.max(0, (1 - o.Y) * 255),
    };
  };

  root.CMY_CMYK = function (o) {
    var C = o.C;
    var M = o.M;
    var Y = o.Y;
    var K = Math.min(Y, Math.min(M, Math.min(C, 1)));
    C = Math.round(((C - K) / (1 - K)) * 100);
    M = Math.round(((M - K) / (1 - K)) * 100);
    Y = Math.round(((Y - K) / (1 - K)) * 100);
    K = Math.round(K * 100);
    return {
      C: C,
      M: M,
      Y: Y,
      K: K,
    };
  };

  // CMYK = C: Cyan / M: Magenta / Y: Yellow / K: Key (black)

  root.CMYK_CMY = function (o) {
    return {
      C: o.C * (1 - o.K) + o.K,
      M: o.M * (1 - o.K) + o.K,
      Y: o.Y * (1 - o.K) + o.K,
    };
  };

  // HSL (1978) = H: Hue / S: Saturation / L: Lightess
  // en.wikipedia.org/wiki/HSL_and_HSV

  root.HSLA_RGBA = root.HSL_RGB = function (o) {
    var H = o.H / 360;
    var S = o.S / 100;
    var L = o.L / 100;
    var R, G, B;
    var temp1, temp2, temp3;
    if (S === 0) {
      R = G = B = L;
    } else {
      if (L < 0.5) temp2 = L * (1 + S);
      else temp2 = L + S - S * L;
      temp1 = 2 * L - temp2;
      // calculate red
      temp3 = H + 1 / 3;
      if (temp3 < 0) temp3 += 1;
      if (temp3 > 1) temp3 -= 1;
      if (6 * temp3 < 1) R = temp1 + (temp2 - temp1) * 6 * temp3;
      else if (2 * temp3 < 1) R = temp2;
      else if (3 * temp3 < 2) R = temp1 + (temp2 - temp1) * (2 / 3 - temp3) * 6;
      else R = temp1;
      // calculate green
      temp3 = H;
      if (temp3 < 0) temp3 += 1;
      if (temp3 > 1) temp3 -= 1;
      if (6 * temp3 < 1) G = temp1 + (temp2 - temp1) * 6 * temp3;
      else if (2 * temp3 < 1) G = temp2;
      else if (3 * temp3 < 2) G = temp1 + (temp2 - temp1) * (2 / 3 - temp3) * 6;
      else G = temp1;
      // calculate blue
      temp3 = H - 1 / 3;
      if (temp3 < 0) temp3 += 1;
      if (temp3 > 1) temp3 -= 1;
      if (6 * temp3 < 1) B = temp1 + (temp2 - temp1) * 6 * temp3;
      else if (2 * temp3 < 1) B = temp2;
      else if (3 * temp3 < 2) B = temp1 + (temp2 - temp1) * (2 / 3 - temp3) * 6;
      else B = temp1;
    }
    return {
      R: R * 255,
      G: G * 255,
      B: B * 255,
      A: o.A,
    };
  };

  // HSV (1978) = H: Hue / S: Saturation / V: Value
  // en.wikipedia.org/wiki/HSL_and_HSV

  root.HSVA_RGBA = root.HSV_RGB = function (o) {
    var H = o.H / 360;
    var S = o.S / 100;
    var V = o.V / 100;
    var R, G, B, D, A, C;
    if (S === 0) {
      R = G = B = Math.round(V * 255);
    } else {
      if (H >= 1) H = 0;
      H = 6 * H;
      D = H - Math.floor(H);
      A = Math.round(255 * V * (1 - S));
      B = Math.round(255 * V * (1 - S * D));
      C = Math.round(255 * V * (1 - S * (1 - D)));
      V = Math.round(255 * V);
      switch (Math.floor(H)) {
        case 0:
          R = V;
          G = C;
          B = A;
          break;
        case 1:
          R = B;
          G = V;
          B = A;
          break;
        case 2:
          R = A;
          G = V;
          B = C;
          break;
        case 3:
          R = A;
          G = B;
          B = V;
          break;
        case 4:
          R = C;
          G = A;
          B = V;
          break;
        case 5:
          R = V;
          G = A;
          B = B;
          break;
      }
    }
    return {
      R: R,
      G: G,
      B: B,
      A: o.A,
    };
  };
})();

const dataC = {
  "Isaac Newton (1704)": {
    format: "HSL",
    ref: "Gerstner, p.167",
    english: [
      "red",
      null,
      "orange",
      null,
      "yellow",
      "green",
      null,
      "blue",
      null,
      "indigo",
      null,
      "violet",
    ],
    0: [0, 96, 51], // C
    1: [0, 0, 0], // C#
    2: [29, 94, 52], // D
    3: [0, 0, 0], // D#
    4: [60, 90, 60], // E
    5: [135, 76, 32], // F
    6: [0, 0, 0], // F#
    7: [248, 82, 28], // G
    8: [0, 0, 0], // G#
    9: [302, 88, 26], // A
    10: [0, 0, 0], // A#
    11: [325, 84, 46], // B
  },
  "Louis Bertrand Castel (1734)": {
    format: "HSL",
    ref: "Peacock, p.400",
    english: [
      "blue",
      "blue-green",
      "green",
      "olive green",
      "yellow",
      "yellow-orange",
      "orange",
      "red",
      "crimson",
      "violet",
      "agate",
      "indigo",
    ],
    0: [248, 82, 28],
    1: [172, 68, 34],
    2: [135, 76, 32],
    3: [79, 59, 36],
    4: [60, 90, 60],
    5: [49, 90, 60],
    6: [29, 94, 52],
    7: [360, 96, 51],
    8: [1, 89, 33],
    9: [325, 84, 46],
    10: [273, 80, 27],
    11: [302, 88, 26],
  },
  "George Field (1816)": {
    format: "HSL",
    ref: "Klein, p.69",
    english: [
      "blue",
      null,
      "purple",
      null,
      "red",
      "orange",
      null,
      "yellow",
      null,
      "yellow green",
      null,
      "green",
    ],
    0: [248, 82, 28],
    1: [0, 0, 0],
    2: [302, 88, 26],
    3: [0, 0, 0],
    4: [360, 96, 51],
    5: [29, 94, 52],
    6: [0, 0, 0],
    7: [60, 90, 60],
    8: [0, 0, 0],
    9: [79, 59, 36],
    10: [0, 0, 0],
    11: [135, 76, 32],
  },
  "D. D. Jameson (1844)": {
    format: "HSL",
    ref: "Jameson, p.12",
    english: [
      "red",
      "red-orange",
      "orange",
      "orange-yellow",
      "yellow",
      "green",
      "green-blue",
      "blue",
      "blue-purple",
      "purple",
      "purple-violet",
      "violet",
    ],
    0: [360, 96, 51],
    1: [14, 91, 51],
    2: [29, 94, 52],
    3: [49, 90, 60],
    4: [60, 90, 60],
    5: [135, 76, 32],
    6: [172, 68, 34],
    7: [248, 82, 28],
    8: [273, 80, 27],
    9: [302, 88, 26],
    10: [313, 78, 37],
    11: [325, 84, 46],
  },
  "Theodor Seemann (1881)": {
    format: "HSL",
    ref: "Klein, p.86",
    english: [
      "carmine",
      "scarlet",
      "orange",
      "yellow-orange",
      "yellow",
      "green",
      "green blue",
      "blue",
      "indigo",
      "violet",
      "brown",
      "black",
    ],
    0: [0, 58, 26],
    1: [360, 96, 51],
    2: [29, 94, 52],
    3: [49, 90, 60],
    4: [60, 90, 60],
    5: [135, 76, 32],
    6: [172, 68, 34],
    7: [248, 82, 28],
    8: [302, 88, 26],
    9: [325, 84, 46],
    10: [0, 58, 26],
    11: [0, 0, 3],
  },
  "A. Wallace Rimington (1893)": {
    format: "HSL",
    ref: "Peacock, p.402",
    english: [
      "deep red",
      "crimson",
      "orange-crimson",
      "orange",
      "yellow",
      "yellow-green",
      "green",
      "blueish green",
      "blue-green",
      "indigo",
      "deep blue",
      "violet",
    ],
    0: [360, 96, 51],
    1: [1, 89, 33],
    2: [14, 91, 51],
    3: [29, 94, 52],
    4: [60, 90, 60],
    5: [79, 59, 36],
    6: [135, 76, 32],
    7: [163, 62, 40],
    8: [172, 68, 34],
    9: [302, 88, 26],
    10: [248, 82, 28],
    11: [325, 84, 46],
  },
  "Bainbridge Bishop (1893)": {
    format: "HSL",
    ref: "Bishop, p.11",
    english: [
      "red",
      "orange-red or scarlet",
      "orange",
      "gold or yellow-orange",
      "yellow or green-gold",
      "yellow-green",
      "green",
      "greenish-blue or aquamarine",
      "blue",
      "indigo or violet-blue",
      "violet",
      "violet-red",
      "red",
    ],
    0: [360, 96, 51],
    1: [1, 89, 33],
    2: [29, 94, 52],
    3: [50, 93, 52],
    4: [60, 90, 60],
    5: [73, 73, 55],
    6: [135, 76, 32],
    7: [163, 62, 40],
    8: [302, 88, 26],
    9: [325, 84, 46],
    10: [343, 79, 47],
    11: [360, 96, 51],
  },
  "H. von Helmholtz (1910)": {
    format: "HSL",
    ref: "Helmholtz, p.22",
    english: [
      "yellow",
      "green",
      "greenish blue",
      "cayan-blue",
      "indigo blue",
      "violet",
      "end of red",
      "red",
      "red",
      "red",
      "red orange",
      "orange",
    ],
    0: [60, 90, 60],
    1: [135, 76, 32],
    2: [172, 68, 34],
    3: [211, 70, 37],
    4: [302, 88, 26],
    5: [325, 84, 46],
    6: [330, 84, 34],
    7: [360, 96, 51],
    8: [10, 91, 43],
    9: [10, 91, 43],
    10: [8, 93, 51],
    11: [28, 89, 50],
  },
  "Alexander Scriabin (1911)": {
    format: "HSL",
    ref: "Jones, p.104",
    english: [
      "red",
      "violet",
      "yellow",
      "steely with the glint of metal",
      "pearly blue the shimmer of moonshine",
      "dark red",
      "bright blue",
      "rosy orange",
      "purple",
      "green",
      "steely with a glint of metal",
      "pearly blue the shimmer of moonshine",
    ],
    0: [360, 96, 51],
    1: [325, 84, 46],
    2: [60, 90, 60],
    3: [245, 21, 43],
    4: [211, 70, 37],
    5: [1, 89, 33],
    6: [248, 82, 28],
    7: [29, 94, 52],
    8: [302, 88, 26],
    9: [135, 76, 32],
    10: [245, 21, 43],
    11: [211, 70, 37],
  },
  "Adrian Bernard Klein (1930)": {
    format: "HSL",
    ref: "Klein, p.209",
    english: [
      "dark red",
      "red",
      "red orange",
      "orange",
      "yellow",
      "yellow green",
      "green",
      "blue-green",
      "blue",
      "blue violet",
      "violet",
      "dark violet",
    ],
    0: [0, 91, 40],
    1: [360, 96, 51],
    2: [14, 91, 51],
    3: [29, 94, 52],
    4: [60, 90, 60],
    5: [73, 73, 55],
    6: [135, 76, 32],
    7: [172, 68, 34],
    8: [248, 82, 28],
    9: [292, 70, 31],
    10: [325, 84, 46],
    11: [330, 84, 34],
  },
  "August Aeppli (1940)": {
    format: "HSL",
    ref: "Gerstner, p.169",
    english: [
      "red",
      null,
      "orange",
      null,
      "yellow",
      null,
      "green",
      "blue-green",
      null,
      "ultramarine blue",
      "violet",
      "purple",
    ],
    0: [0, 96, 51],
    1: [0, 0, 0],
    2: [29, 94, 52],
    3: [0, 0, 0],
    4: [60, 90, 60],
    5: [0, 0, 0],
    6: [135, 76, 32],
    7: [172, 68, 34],
    8: [0, 0, 0],
    9: [211, 70, 37],
    10: [273, 80, 27],
    11: [302, 88, 26],
  },
  "I. J. Belmont (1944)": {
    ref: "Belmont, p.226",
    english: [
      "red",
      "red-orange",
      "orange",
      "yellow-orange",
      "yellow",
      "yellow-green",
      "green",
      "blue-green",
      "blue",
      "blue-violet",
      "violet",
      "red-violet",
    ],
    0: [360, 96, 51],
    1: [14, 91, 51],
    2: [29, 94, 52],
    3: [50, 93, 52],
    4: [60, 90, 60],
    5: [73, 73, 55],
    6: [135, 76, 32],
    7: [172, 68, 34],
    8: [248, 82, 28],
    9: [313, 78, 37],
    10: [325, 84, 46],
    11: [338, 85, 37],
  },
  "Steve Zieverink (2004)": {
    format: "HSL",
    ref: "Cincinnati Contemporary Art Center",
    english: [
      "yellow-green",
      "green",
      "blue-green",
      "blue",
      "indigo",
      "violet",
      "ultra violet",
      "infra red",
      "red",
      "orange",
      "yellow-white",
      "yellow",
    ],
    0: [73, 73, 55],
    1: [135, 76, 32],
    2: [172, 68, 34],
    3: [248, 82, 28],
    4: [302, 88, 26],
    5: [325, 84, 46],
    6: [326, 79, 24],
    7: [1, 89, 33],
    8: [360, 96, 51],
    9: [29, 94, 52],
    10: [62, 78, 74],
    11: [60, 90, 60],
  },
  "Circle of Fifths (Johnston 2003)": {
    format: "RGB",
    ref: "Joseph Johnston",
    english: [
      "yellow",
      "blue",
      "orange",
      "teal",
      "red",
      "green",
      "purple",
      "light orange",
      "light blue",
      "dark orange",
      "dark green",
      "violet",
    ],
    0: [255, 255, 0],
    1: [50, 0, 255],
    2: [255, 150, 0],
    3: [0, 210, 180],
    4: [255, 0, 0],
    5: [130, 255, 0],
    6: [150, 0, 200],
    7: [255, 195, 0],
    8: [30, 130, 255],
    9: [255, 100, 0],
    10: [0, 200, 0],
    11: [225, 0, 225],
  },
  "Circle of Fifths (Wheatman 2002)": {
    format: "HEX",
    ref: "Stuart Wheatman", // http://www.valleysfamilychurch.org/
    english: [],
    data: [
      "#122400",
      "#2E002E",
      "#002914",
      "#470000",
      "#002142",
      "#2E2E00",
      "#290052",
      "#003D00",
      "#520029",
      "#003D3D",
      "#522900",
      "#000080",
      "#244700",
      "#570057",
      "#004D26",
      "#7A0000",
      "#003B75",
      "#4C4D00",
      "#47008F",
      "#006100",
      "#850042",
      "#005C5C",
      "#804000",
      "#0000C7",
      "#366B00",
      "#80007F",
      "#00753B",
      "#B80000",
      "#0057AD",
      "#6B6B00",
      "#6600CC",
      "#008A00",
      "#B8005C",
      "#007F80",
      "#B35900",
      "#2424FF",
      "#478F00",
      "#AD00AD",
      "#00994D",
      "#F00000",
      "#0073E6",
      "#8F8F00",
      "#8A14FF",
      "#00AD00",
      "#EB0075",
      "#00A3A3",
      "#E07000",
      "#6B6BFF",
      "#5CB800",
      "#DB00DB",
      "#00C261",
      "#FF5757",
      "#3399FF",
      "#ADAD00",
      "#B56BFF",
      "#00D600",
      "#FF57AB",
      "#00C7C7",
      "#FF9124",
      "#9999FF",
      "#6EDB00",
      "#FF29FF",
      "#00E070",
      "#FF9999",
      "#7ABDFF",
      "#D1D100",
      "#D1A3FF",
      "#00FA00",
      "#FFA3D1",
      "#00E5E6",
      "#FFC285",
      "#C2C2FF",
      "#80FF00",
      "#FFA8FF",
      "#00E070",
      "#FFCCCC",
      "#C2E0FF",
      "#F0F000",
      "#EBD6FF",
      "#ADFFAD",
      "#FFD6EB",
      "#8AFFFF",
      "#FFEBD6",
      "#EBEBFF",
      "#E0FFC2",
      "#FFEBFF",
      "#E5FFF2",
      "#FFF5F5",
    ],
  },
};

const map = function (type) {
  var data = {};
  var blend = function (a, b) {
    return [
      // blend two colors and round results
      (a[0] * 0.5 + b[0] * 0.5 + 0.5) >> 0,
      (a[1] * 0.5 + b[1] * 0.5 + 0.5) >> 0,
      (a[2] * 0.5 + b[2] * 0.5 + 0.5) >> 0,
    ];
  };
  ///
  var syn = dataC;
  var colors = syn[type] || syn["D. D. Jameson (1844)"];
  for (var note = 0, pclr, H, S, L; note <= 128; note++) {
    // creates mapping for 88 notes
    if (colors.data) {
      data[note] = {
        hsl: colors.data[note],
        hex: colors.data[note],
      };
    } else {
      var clr = colors[(note + 9) % 12];
      ///
      switch (colors.format) {
        case "RGB":
          clr = Color.Space(clr, "RGB>HSL");
          H = clr.H >> 0;
          S = clr.S >> 0;
          L = clr.L >> 0;
          break;
        case "HSL":
          H = clr[0];
          S = clr[1];
          L = clr[2];
          break;
      }
      ///
      if (H === S && S === L) {
        // note color is unset
        clr = blend(pclr, colors[(note + 10) % 12]);
      }
      ///
      // 				var amount = L / 10;
      // 				var octave = note / 12 >> 0;
      // 				var octaveLum = L + amount * octave - 3.0 * amount; // map luminance to octave
      ///
      // data[note] = {
      //   hsl: "hsla(" + H + "," + S + "%," + L + "%, 1)",
      //   hex: Color.Space({ H: H, S: S, L: L }, "HSL>RGB>HEX>W3"),
      // };

      data[note] = "hsla(" + H + "," + S + "%," + L + "%, 1)";
      ///
      pclr = clr;
    }
  }
  return data;
};

// Louis Bertrand Castel (1734) => 5

const fs = require('fs');
fs.writeFile("src/data/colors.json",JSON.stringify(map("Louis Bertrand Castel (1734)")), 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");
});
