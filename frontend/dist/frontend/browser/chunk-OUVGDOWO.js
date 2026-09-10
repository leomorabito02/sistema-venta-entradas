import {
  ActivatedRoute,
  RouterLink
} from "./chunk-ADJ2KLCM.js";
import {
  ApiService
} from "./chunk-BUOOEH3R.js";
import {
  CommonModule,
  Component,
  DatePipe,
  DecimalPipe,
  NgIf,
  __commonJS,
  __toESM,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpropertyInterpolate1,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-SFLJKOAY.js";

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/can-promise.js
var require_can_promise = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/can-promise.js"(exports, module) {
    "use strict";
    module.exports = function() {
      return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/utils.js
var require_utils = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/utils.js"(exports) {
    "use strict";
    var toSJISFunction;
    var CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    exports.getSymbolSize = function getSymbolSize(version) {
      if (!version) throw new Error('"version" cannot be null or undefined');
      if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
      return version * 4 + 17;
    };
    exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
      return CODEWORDS_COUNT[version];
    };
    exports.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    exports.setToSJISFunction = function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    };
    exports.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    exports.toSJIS = function toSJIS(kanji) {
      return toSJISFunction(kanji);
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
    "use strict";
    exports.L = {
      bit: 1
    };
    exports.M = {
      bit: 0
    };
    exports.Q = {
      bit: 3
    };
    exports.H = {
      bit: 2
    };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    exports.isValid = function isValid(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    };
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
    "use strict";
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    BitBuffer.prototype = {
      get: function(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      },
      put: function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    module.exports = BitBuffer;
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
    "use strict";
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }
    BitMatrix.prototype.set = function(row, col, value, reserved) {
      const index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value) {
      this.data[row * this.size + col] ^= value;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    module.exports = BitMatrix;
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
    "use strict";
    var getSymbolSize = require_utils().getSymbolSize;
    exports.getRowColCoords = function getRowColCoords(version) {
      if (version === 1) return [];
      const posCount = Math.floor(version / 7) + 2;
      const size = getSymbolSize(version);
      const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      const positions = [size - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    };
    exports.getPositions = function getPositions(version) {
      const coords = [];
      const pos = exports.getRowColCoords(version);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
    "use strict";
    var getSymbolSize = require_utils().getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;
    exports.getPositions = function getPositions(version) {
      const size = getSymbolSize(version);
      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ];
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
    "use strict";
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = function isValid(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    };
    exports.from = function from(value) {
      return exports.isValid(value) ? parseInt(value, 10) : void 0;
    };
    exports.getPenaltyN1 = function getPenaltyN1(data) {
      const size = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size; col++) {
          let module2 = data.get(row, col);
          if (module2 === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module2;
            sameCountCol = 1;
          }
          module2 = data.get(col, row);
          if (module2 === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module2;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    };
    exports.getPenaltyN2 = function getPenaltyN2(data) {
      const size = data.size;
      let points = 0;
      for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    };
    exports.getPenaltyN3 = function getPenaltyN3(data) {
      const size = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    };
    exports.getPenaltyN4 = function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k * PenaltyScores.N4;
    };
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }
    exports.applyMask = function applyMask(pattern, data) {
      const size = data.size;
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };
    exports.getBestMask = function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }
      return bestPattern;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
    "use strict";
    var ECLevel = require_error_correction_level();
    var EC_BLOCKS_TABLE = [
      // L  M  Q  H
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    var EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/galois-field.js"(exports) {
    "use strict";
    var EXP_TABLE = new Uint8Array(512);
    var LOG_TABLE = new Uint8Array(256);
    (function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    })();
    exports.log = function log(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    };
    exports.exp = function exp(n) {
      return EXP_TABLE[n];
    };
    exports.mul = function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/polynomial.js"(exports) {
    "use strict";
    var GF = require_galois_field();
    exports.mul = function mul(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    };
    exports.mod = function mod(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    };
    exports.generateECPolynomial = function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
    "use strict";
    var Polynomial = require_polynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    };
    ReedSolomonEncoder.prototype.encode = function encode(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);
        return buff;
      }
      return remainder;
    };
    module.exports = ReedSolomonEncoder;
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version-check.js"(exports) {
    "use strict";
    exports.isValid = function isValid(version) {
      return !isNaN(version) && version >= 1 && version <= 40;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/regex.js"(exports) {
    "use strict";
    var numeric = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric + "$");
    var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    exports.testKanji = function testKanji(str) {
      return TEST_KANJI.test(str);
    };
    exports.testNumeric = function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    };
    exports.testAlphanumeric = function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/mode.js"(exports) {
    "use strict";
    var VersionCheck = require_version_check();
    var Regex = require_regex();
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
      if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid version: " + version);
      }
      if (version >= 1 && version < 10) return mode.ccBits[0];
      else if (version < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    };
    exports.getBestModeForData = function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    };
    exports.toString = function toString(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error("Invalid mode");
    };
    exports.isValid = function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version.js
var require_version = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/version.js"(exports) {
    "use strict";
    var Utils = require_utils();
    var ECCode = require_error_correction_code();
    var ECLevel = require_error_correction_level();
    var Mode = require_mode();
    var VersionCheck = require_version_check();
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);
    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    function getReservedBitsCount(mode, version) {
      return Mode.getCharCountIndicator(mode, version) + 4;
    }
    function getTotalBitsFromDataArray(segments, version) {
      let totalBits = 0;
      segments.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    exports.from = function from(value, defaultValue) {
      if (VersionCheck.isValid(value)) {
        return parseInt(value, 10);
      }
      return defaultValue;
    };
    exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode === "undefined") mode = Mode.BYTE;
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode === Mode.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode.KANJI:
          return Math.floor(usableBits / 13);
        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    };
    exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
      let seg;
      const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    };
    exports.getEncodedBits = function getEncodedBits(version) {
      if (!VersionCheck.isValid(version) || version < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version << 12;
      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }
      return version << 12 | d;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/format-info.js"(exports) {
    "use strict";
    var Utils = require_utils();
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);
    exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
      const data = errorCorrectionLevel.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
    "use strict";
    var Mode = require_mode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    NumericData.getBitsLength = function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    };
    NumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    NumericData.prototype.getBitsLength = function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    };
    NumericData.prototype.write = function write(bitBuffer) {
      let i, group, value;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);
        bitBuffer.put(value, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);
        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    };
    module.exports = NumericData;
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
    "use strict";
    var Mode = require_mode();
    var ALPHA_NUM_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", " ", "$", "%", "*", "+", "-", ".", "/", ":"];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    AlphanumericData.getBitsLength = function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    };
    AlphanumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    AlphanumericData.prototype.getBitsLength = function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    };
    AlphanumericData.prototype.write = function write(bitBuffer) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer.put(value, 11);
      }
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };
    module.exports = AlphanumericData;
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
    "use strict";
    var Mode = require_mode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    ByteData.getBitsLength = function getBitsLength(length) {
      return length * 8;
    };
    ByteData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    ByteData.prototype.getBitsLength = function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    };
    ByteData.prototype.write = function(bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };
    module.exports = ByteData;
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
    "use strict";
    var Mode = require_mode();
    var Utils = require_utils();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    KanjiData.getBitsLength = function getBitsLength(length) {
      return length * 13;
    };
    KanjiData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    KanjiData.prototype.getBitsLength = function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    };
    KanjiData.prototype.write = function(bitBuffer) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value = Utils.toSJIS(this.data[i]);
        if (value >= 33088 && value <= 40956) {
          value -= 33088;
        } else if (value >= 57408 && value <= 60351) {
          value -= 49472;
        } else {
          throw new Error("Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8");
        }
        value = (value >>> 8 & 255) * 192 + (value & 255);
        bitBuffer.put(value, 13);
      }
    };
    module.exports = KanjiData;
  }
});

// node_modules/.pnpm/dijkstrajs@1.0.3/node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = __commonJS({
  "node_modules/.pnpm/dijkstrajs@1.0.3/node_modules/dijkstrajs/dijkstra.js"(exports, module) {
    "use strict";
    var dijkstra = {
      single_source_shortest_paths: function(graph, s, d) {
        var predecessors = {};
        var costs = {};
        costs[s] = 0;
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);
        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;
          adjacent_nodes = graph[u] || {};
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              cost_of_e = adjacent_nodes[v];
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === "undefined";
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }
        if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
          var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
          throw new Error(msg);
        }
        return predecessors;
      },
      extract_shortest_path_from_predecessor_list: function(predecessors, d) {
        var nodes = [];
        var u = d;
        var predecessor;
        while (u) {
          nodes.push(u);
          predecessor = predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      },
      find_path: function(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(predecessors, d);
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(opts) {
          var T = dijkstra.PriorityQueue, t = {}, key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        },
        default_sorter: function(a, b) {
          return a.cost - b.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(value, cost) {
          var item = {
            value,
            cost
          };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        },
        /**
         * Return the highest priority element in the queue.
         */
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    if (typeof module !== "undefined") {
      module.exports = dijkstra;
    }
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/segments.js"(exports) {
    "use strict";
    var Mode = require_mode();
    var NumericData = require_numeric_data();
    var AlphanumericData = require_alphanumeric_data();
    var ByteData = require_byte_data();
    var KanjiData = require_kanji_data();
    var Regex = require_regex();
    var Utils = require_utils();
    var dijkstra = require_dijkstra();
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    function getSegments(regex, mode, str) {
      const segments = [];
      let result;
      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode,
          length: result[0].length
        });
      }
      return segments;
    }
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([seg, {
              data: seg.data,
              mode: Mode.ALPHANUMERIC,
              length: seg.length
            }, {
              data: seg.data,
              mode: Mode.BYTE,
              length: seg.length
            }]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([seg, {
              data: seg.data,
              mode: Mode.BYTE,
              length: seg.length
            }]);
            break;
          case Mode.KANJI:
            nodes.push([seg, {
              data: seg.data,
              mode: Mode.BYTE,
              length: getStringByteLength(seg.data)
            }]);
            break;
          case Mode.BYTE:
            nodes.push([{
              data: seg.data,
              mode: Mode.BYTE,
              length: getStringByteLength(seg.data)
            }]);
        }
      }
      return nodes;
    }
    function buildGraph(nodes, version) {
      const table = {};
      const graph = {
        start: {}
      };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table[key] = {
            node,
            lastCount: 0
          };
          graph[key] = {};
          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];
            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }
      return {
        map: graph,
        table
      };
    }
    function buildSingleSegment(data, modesHint) {
      let mode;
      const bestMode = Mode.getBestModeForData(data);
      mode = Mode.from(modesHint, bestMode);
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
      }
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }
      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);
        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);
        case Mode.KANJI:
          return new KanjiData(data);
        case Mode.BYTE:
          return new ByteData(data);
      }
    }
    exports.fromArray = function fromArray(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    };
    exports.fromString = function fromString(data, version) {
      const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version);
      const path = dijkstra.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    };
    exports.rawSplit = function rawSplit(data) {
      return exports.fromArray(getSegmentsFromString(data, Utils.isKanjiModeEnabled()));
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/core/qrcode.js"(exports) {
    "use strict";
    var Utils = require_utils();
    var ECLevel = require_error_correction_level();
    var BitBuffer = require_bit_buffer();
    var BitMatrix = require_bit_matrix();
    var AlignmentPattern = require_alignment_pattern();
    var FinderPattern = require_finder_pattern();
    var MaskPattern = require_mask_pattern();
    var ECCode = require_error_correction_code();
    var ReedSolomonEncoder = require_reed_solomon_encoder();
    var Version = require_version();
    var FormatInfo = require_format_info();
    var Mode = require_mode();
    var Segments = require_segments();
    function setupFinderPattern(matrix, version) {
      const size = matrix.size;
      const pos = FinderPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupTimingPattern(matrix) {
      const size = matrix.size;
      for (let r = 8; r < size - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }
    function setupAlignmentPattern(matrix, version) {
      const pos = AlignmentPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupVersionInfo(matrix, version) {
      const size = matrix.size;
      const bits = Version.getEncodedBits(version);
      let row, col, mod;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = (bits >> i & 1) === 1;
        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      const size = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod;
      for (i = 0; i < 15; i++) {
        mod = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }
      matrix.set(size - 8, 8, 1, true);
    }
    function setupData(matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    function createData(version, errorCorrectionLevel, segments) {
      const buffer = new BitBuffer();
      segments.forEach(function(data) {
        buffer.put(data.mode.bit, 4);
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
        data.write(buffer);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer, version, errorCorrectionLevel);
    }
    function createCodewords(bitBuffer, version, errorCorrectionLevel) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }
      return data;
    }
    function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
      let segments;
      if (Array.isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version) {
        version = bestVersion;
      } else if (version < bestVersion) {
        throw new Error("\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n");
      }
      const dataBits = createData(version, errorCorrectionLevel, segments);
      const moduleCount = Utils.getSymbolSize(version);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version);
      setupFormatInfo(modules, errorCorrectionLevel, 0);
      if (version >= 7) {
        setupVersionInfo(modules, version);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern)) {
        maskPattern = MaskPattern.getBestMask(modules, setupFormatInfo.bind(null, modules, errorCorrectionLevel));
      }
      MaskPattern.applyMask(maskPattern, modules);
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
      return {
        modules,
        version,
        errorCorrectionLevel,
        maskPattern,
        segments
      };
    }
    exports.create = function create(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel = ECLevel.M;
      let version;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version, errorCorrectionLevel, mask);
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/utils.js
var require_utils2 = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/utils.js"(exports) {
    "use strict";
    function hex2rgba(hex) {
      if (typeof hex === "number") {
        hex = hex.toString();
      }
      if (typeof hex !== "string") {
        throw new Error("Color should be defined as hex string");
      }
      let hexCode = hex.slice().replace("#", "").split("");
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error("Invalid hex color: " + hex);
      }
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
          return [c, c];
        }));
      }
      if (hexCode.length === 6) hexCode.push("F", "F");
      const hexValue = parseInt(hexCode.join(""), 16);
      return {
        r: hexValue >> 24 & 255,
        g: hexValue >> 16 & 255,
        b: hexValue >> 8 & 255,
        a: hexValue & 255,
        hex: "#" + hexCode.slice(0, 6).join("")
      };
    }
    exports.getOptions = function getOptions(options) {
      if (!options) options = {};
      if (!options.color) options.color = {};
      const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
      const width = options.width && options.width >= 21 ? options.width : void 0;
      const scale = options.scale || 4;
      return {
        width,
        scale: width ? 4 : scale,
        margin,
        color: {
          dark: hex2rgba(options.color.dark || "#000000ff"),
          light: hex2rgba(options.color.light || "#ffffffff")
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      };
    };
    exports.getScale = function getScale(qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
    };
    exports.getImageWidth = function getImageWidth(qrSize, opts) {
      const scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale);
    };
    exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
      const size = qr.modules.size;
      const data = qr.modules.data;
      const scale = exports.getScale(size, opts);
      const symbolSize = Math.floor((size + opts.margin * 2) * scale);
      const scaledMargin = opts.margin * scale;
      const palette = [opts.color.light, opts.color.dark];
      for (let i = 0; i < symbolSize; i++) {
        for (let j = 0; j < symbolSize; j++) {
          let posDst = (i * symbolSize + j) * 4;
          let pxColor = opts.color.light;
          if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            const iSrc = Math.floor((i - scaledMargin) / scale);
            const jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
          }
          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/canvas.js
var require_canvas = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/canvas.js"(exports) {
    "use strict";
    var Utils = require_utils2();
    function clearCanvas(ctx, canvas, size) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!canvas.style) canvas.style = {};
      canvas.height = size;
      canvas.width = size;
      canvas.style.height = size + "px";
      canvas.style.width = size + "px";
    }
    function getCanvasElement() {
      try {
        return document.createElement("canvas");
      } catch (e) {
        throw new Error("You need to specify a canvas element");
      }
    }
    exports.render = function render(qrData, canvas, options) {
      let opts = options;
      let canvasEl = canvas;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!canvas) {
        canvasEl = getCanvasElement();
      }
      opts = Utils.getOptions(opts);
      const size = Utils.getImageWidth(qrData.modules.size, opts);
      const ctx = canvasEl.getContext("2d");
      const image = ctx.createImageData(size, size);
      Utils.qrToImageData(image.data, qrData, opts);
      clearCanvas(ctx, canvasEl, size);
      ctx.putImageData(image, 0, 0);
      return canvasEl;
    };
    exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
      let opts = options;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!opts) opts = {};
      const canvasEl = exports.render(qrData, canvas, opts);
      const type = opts.type || "image/png";
      const rendererOpts = opts.rendererOpts || {};
      return canvasEl.toDataURL(type, rendererOpts.quality);
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/svg-tag.js
var require_svg_tag = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
    "use strict";
    var Utils = require_utils2();
    function getColorAttrib(color, attrib) {
      const alpha = color.a / 255;
      const str = attrib + '="' + color.hex + '"';
      return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
    }
    function svgCmd(cmd, x, y) {
      let str = cmd + x;
      if (typeof y !== "undefined") str += " " + y;
      return str;
    }
    function qrToPath(data, size, margin) {
      let path = "";
      let moveBy = 0;
      let newRow = false;
      let lineLength = 0;
      for (let i = 0; i < data.length; i++) {
        const col = Math.floor(i % size);
        const row = Math.floor(i / size);
        if (!col && !newRow) newRow = true;
        if (data[i]) {
          lineLength++;
          if (!(i > 0 && col > 0 && data[i - 1])) {
            path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
            moveBy = 0;
            newRow = false;
          }
          if (!(col + 1 < size && data[i + 1])) {
            path += svgCmd("h", lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }
      return path;
    }
    exports.render = function render(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const qrcodesize = size + opts.margin * 2;
      const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
      const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
      const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
      const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
      const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
      if (typeof cb === "function") {
        cb(null, svgTag);
      }
      return svgTag;
    };
  }
});

// node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/browser.js
var require_browser = __commonJS({
  "node_modules/.pnpm/qrcode@1.5.4/node_modules/qrcode/lib/browser.js"(exports) {
    "use strict";
    var canPromise = require_can_promise();
    var QRCode2 = require_qrcode();
    var CanvasRenderer = require_canvas();
    var SvgRenderer = require_svg_tag();
    function renderCanvas(renderFunc, canvas, text, opts, cb) {
      const args = [].slice.call(arguments, 1);
      const argsNum = args.length;
      const isLastArgCb = typeof args[argsNum - 1] === "function";
      if (!isLastArgCb && !canPromise()) {
        throw new Error("Callback required as last argument");
      }
      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 2) {
          cb = text;
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 3) {
          if (canvas.getContext && typeof cb === "undefined") {
            cb = opts;
            opts = void 0;
          } else {
            cb = opts;
            opts = text;
            text = canvas;
            canvas = void 0;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 1) {
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 2 && !canvas.getContext) {
          opts = text;
          text = canvas;
          canvas = void 0;
        }
        return new Promise(function(resolve, reject) {
          try {
            const data = QRCode2.create(text, opts);
            resolve(renderFunc(data, canvas, opts));
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode2.create(text, opts);
        cb(null, renderFunc(data, canvas, opts));
      } catch (e) {
        cb(e);
      }
    }
    exports.create = QRCode2.create;
    exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
    exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
    exports.toString = renderCanvas.bind(null, function(data, _, opts) {
      return SvgRenderer.render(data, opts);
    });
  }
});

// src/app/features/tickets/public-ticket-view/public-ticket-view.component.ts
var import_qrcode = __toESM(require_browser());

// src/app/shared/components/skeleton-loader/skeleton-loader.component.ts
var SkeletonLoaderComponent = class _SkeletonLoaderComponent {
  static \u0275fac = function SkeletonLoaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SkeletonLoaderComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SkeletonLoaderComponent, selectors: [["app-skeleton-loader"]], decls: 8, vars: 0, consts: [[1, "skeleton-card", "neu-card"], [1, "skeleton-box", "skeleton-title"], [1, "skeleton-box", "skeleton-text"], [1, "skeleton-box", "skeleton-block"], [1, "skeleton-grid"], [1, "skeleton-box", "skeleton-grid-item"]], template: function SkeletonLoaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "div", 1)(2, "div", 2)(3, "div", 3);
      \u0275\u0275elementStart(4, "div", 4);
      \u0275\u0275element(5, "div", 5)(6, "div", 5)(7, "div", 5);
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [CommonModule], styles: ['\n\n.skeleton-box[_ngcontent-%COMP%] {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  overflow: hidden;\n  background-color: #E6DFD3;\n  border-radius: var(--radius-sm);\n}\n.skeleton-box[_ngcontent-%COMP%]::after {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  transform: translateX(-100%);\n  background-image:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0) 0,\n      rgba(255, 255, 255, 0.4) 20%,\n      rgba(255, 255, 255, 0.6) 60%,\n      rgba(255, 255, 255, 0));\n  animation: _ngcontent-%COMP%_shimmer 1.5s infinite;\n  content: "";\n}\n@keyframes _ngcontent-%COMP%_shimmer {\n  100% {\n    transform: translateX(100%);\n  }\n}\n.skeleton-card[_ngcontent-%COMP%] {\n  padding: 2rem;\n  margin: 2rem auto;\n  max-width: 900px;\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n}\n.skeleton-title[_ngcontent-%COMP%] {\n  width: 50%;\n  height: 2rem;\n  border-radius: var(--radius-sm);\n}\n.skeleton-text[_ngcontent-%COMP%] {\n  width: 80%;\n  height: 1.2rem;\n  border-radius: var(--radius-sm);\n}\n.skeleton-block[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 120px;\n  border-radius: var(--radius-md);\n}\n.skeleton-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 1rem;\n}\n.skeleton-grid-item[_ngcontent-%COMP%] {\n  height: 90px;\n  border-radius: var(--radius-md);\n}\n/*# sourceMappingURL=skeleton-loader.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SkeletonLoaderComponent, [{
    type: Component,
    args: [{ selector: "app-skeleton-loader", standalone: true, imports: [CommonModule], template: '<div class="skeleton-card neu-card">\n  <div class="skeleton-box skeleton-title"></div>\n  <div class="skeleton-box skeleton-text"></div>\n  <div class="skeleton-box skeleton-block"></div>\n  <div class="skeleton-grid">\n    <div class="skeleton-box skeleton-grid-item"></div>\n    <div class="skeleton-box skeleton-grid-item"></div>\n    <div class="skeleton-box skeleton-grid-item"></div>\n  </div>\n</div>\n', styles: ['/* src/app/shared/components/skeleton-loader/skeleton-loader.component.css */\n.skeleton-box {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  overflow: hidden;\n  background-color: #E6DFD3;\n  border-radius: var(--radius-sm);\n}\n.skeleton-box::after {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  transform: translateX(-100%);\n  background-image:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0) 0,\n      rgba(255, 255, 255, 0.4) 20%,\n      rgba(255, 255, 255, 0.6) 60%,\n      rgba(255, 255, 255, 0));\n  animation: shimmer 1.5s infinite;\n  content: "";\n}\n@keyframes shimmer {\n  100% {\n    transform: translateX(100%);\n  }\n}\n.skeleton-card {\n  padding: 2rem;\n  margin: 2rem auto;\n  max-width: 900px;\n  display: flex;\n  flex-direction: column;\n  gap: 1.5rem;\n}\n.skeleton-title {\n  width: 50%;\n  height: 2rem;\n  border-radius: var(--radius-sm);\n}\n.skeleton-text {\n  width: 80%;\n  height: 1.2rem;\n  border-radius: var(--radius-sm);\n}\n.skeleton-block {\n  width: 100%;\n  height: 120px;\n  border-radius: var(--radius-md);\n}\n.skeleton-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 1rem;\n}\n.skeleton-grid-item {\n  height: 90px;\n  border-radius: var(--radius-md);\n}\n/*# sourceMappingURL=skeleton-loader.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SkeletonLoaderComponent, { className: "SkeletonLoaderComponent", filePath: "src/app/shared/components/skeleton-loader/skeleton-loader.component.ts", lineNumber: 11 });
})();

// src/app/features/tickets/public-ticket-view/public-ticket-view.component.ts
function PublicTicketViewComponent_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275element(1, "app-skeleton-loader");
    \u0275\u0275elementContainerEnd();
  }
}
function PublicTicketViewComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "div", 5);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(2, "svg", 6);
    \u0275\u0275element(3, "path", 7)(4, "line", 8)(5, "line", 9);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(6, "h2");
    \u0275\u0275text(7, "Bono No Disponible");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 10);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "a", 11);
    \u0275\u0275text(11, "Ir al Inicio");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate(ctx_r0.errorMessage());
  }
}
function PublicTicketViewComponent_div_3_div_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275element(1, "img", 61);
    \u0275\u0275elementStart(2, "span", 62);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_4_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275propertyInterpolate1("alt", "C\xF3digo QR de Validaci\xF3n (C\xF3digo: ", (tmp_2_0 = ctx_r0.ticket()) == null ? null : tmp_2_0.four_digit_code, ")");
    \u0275\u0275property("src", ctx_r0.qrDataUrl(), \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("C\xF3digo QR Oficial (", (tmp_4_0 = ctx_r0.ticket()) == null ? null : tmp_4_0.four_digit_code, ")");
  }
}
function PublicTicketViewComponent_div_3_div_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 63)(1, "span", 64);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(2, "svg", 6);
    \u0275\u0275element(3, "rect", 65)(4, "line", 66);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(5, "span", 62);
    \u0275\u0275text(6, "Generando C\xF3digo QR...");
    \u0275\u0275elementEnd()();
  }
}
function PublicTicketViewComponent_div_3_li_95_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1, " Tu ticket incluye ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3, "1 chorip\xE1n");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, ". Para retirarlo, ac\xE9rcate al puesto gastron\xF3mico y presenta tu c\xF3digo de 4 d\xEDgitos. ");
    \u0275\u0275elementEnd();
  }
}
function PublicTicketViewComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 13)(2, "div", 14);
    \u0275\u0275element(3, "img", 15);
    \u0275\u0275elementStart(4, "div")(5, "h1");
    \u0275\u0275text(6, "Pe\xF1a Seminario 2026");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 16);
    \u0275\u0275text(8, "Seminario Mayor de C\xF3rdoba - Comprobante Oficial");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 17);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 18)(12, "span", 19);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(13, "svg", 6);
    \u0275\u0275element(14, "circle", 20);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(15, "div", 21)(16, "strong");
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 22);
    \u0275\u0275text(19, "Estado actual registrado en el sistema");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "div", 23)(21, "div", 24)(22, "span", 25);
    \u0275\u0275text(23, "C\xD3DIGO DE VALIDACI\xD3N DE 4 D\xCDGITOS");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 26);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "p", 27);
    \u0275\u0275text(27, "Presenta este c\xF3digo de 4 d\xEDgitos al ingresar o retirar tu comida");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 28);
    \u0275\u0275template(29, PublicTicketViewComponent_div_3_div_29_Template, 4, 4, "div", 29)(30, PublicTicketViewComponent_div_3_div_30_Template, 7, 0, "div", 30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(31, "div", 31)(32, "div", 32)(33, "span", 33);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(34, "svg", 6);
    \u0275\u0275element(35, "path", 34)(36, "circle", 35);
    \u0275\u0275elementEnd();
    \u0275\u0275text(37, " Comprador:");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(38, "strong", 36);
    \u0275\u0275text(39);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(40, "div", 32)(41, "span", 33);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(42, "svg", 6);
    \u0275\u0275element(43, "path", 37)(44, "line", 38);
    \u0275\u0275elementEnd();
    \u0275\u0275text(45, " Vendedor / Emisor:");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(46, "strong", 36);
    \u0275\u0275text(47);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(48, "div", 32)(49, "span", 33);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(50, "svg", 6);
    \u0275\u0275element(51, "rect", 39)(52, "line", 40)(53, "line", 41)(54, "line", 42);
    \u0275\u0275elementEnd();
    \u0275\u0275text(55, " Fecha de Compra:");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(56, "strong", 36);
    \u0275\u0275text(57);
    \u0275\u0275pipe(58, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(59, "div", 32)(60, "span", 33);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(61, "svg", 6);
    \u0275\u0275element(62, "path", 43);
    \u0275\u0275elementEnd();
    \u0275\u0275text(63, " Tipo de Bono:");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(64, "strong", 44);
    \u0275\u0275text(65);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(66, "div", 32)(67, "span", 33);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(68, "svg", 6);
    \u0275\u0275element(69, "path", 45)(70, "path", 46)(71, "path", 47);
    \u0275\u0275elementEnd();
    \u0275\u0275text(72, " Almuerzo / Comida:");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(73, "strong", 36);
    \u0275\u0275text(74);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(75, "div", 32)(76, "span", 33);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(77, "svg", 6);
    \u0275\u0275element(78, "line", 48)(79, "path", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275text(80, " Monto Pagado:");
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(81, "strong", 50);
    \u0275\u0275text(82);
    \u0275\u0275pipe(83, "number");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(84, "div", 51)(85, "h3");
    \u0275\u0275text(86, "Instrucciones Importantes para el Asistente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(87, "ul")(88, "li");
    \u0275\u0275text(89, "Guarda o captura la pantalla de este comprobante en tu dispositivo m\xF3vil.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(90, "li");
    \u0275\u0275text(91, "Al llegar al predio de la Pe\xF1a Seminario 2026, presenta el c\xF3digo de 4 d\xEDgitos (");
    \u0275\u0275elementStart(92, "strong");
    \u0275\u0275text(93);
    \u0275\u0275elementEnd();
    \u0275\u0275text(94, ") en el puesto de acceso.");
    \u0275\u0275elementEnd();
    \u0275\u0275template(95, PublicTicketViewComponent_div_3_li_95_Template, 5, 0, "li", 1);
    \u0275\u0275elementStart(96, "li");
    \u0275\u0275text(97, "Este bono es personal e intransferible una vez validado por la organizaci\xF3n.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(98, "div", 52)(99, "button", 53);
    \u0275\u0275listener("click", function PublicTicketViewComponent_div_3_Template_button_click_99_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.copyUrl());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(100, "svg", 6);
    \u0275\u0275element(101, "rect", 54)(102, "path", 55);
    \u0275\u0275elementEnd();
    \u0275\u0275text(103);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(104, "button", 56);
    \u0275\u0275listener("click", function PublicTicketViewComponent_div_3_Template_button_click_104_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.printTicket());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(105, "svg", 6);
    \u0275\u0275element(106, "polyline", 57)(107, "path", 58)(108, "rect", 59);
    \u0275\u0275elementEnd();
    \u0275\u0275text(109, " Imprimir / Guardar en PDF ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_10_0;
    let tmp_11_0;
    let tmp_12_0;
    let tmp_13_0;
    let tmp_14_0;
    let tmp_15_0;
    let tmp_16_0;
    let tmp_17_0;
    let tmp_18_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate1(" #Bono ", (tmp_1_0 = ctx_r0.ticket()) == null ? null : tmp_1_0.ticket_number, " ");
    \u0275\u0275advance();
    \u0275\u0275classProp("status-vendido", ((tmp_2_0 = ctx_r0.ticket()) == null ? null : tmp_2_0.status) === "VENDIDO")("status-entrada", ((tmp_3_0 = ctx_r0.ticket()) == null ? null : tmp_3_0.status) === "USADO_ENTRADA")("status-comida", ((tmp_4_0 = ctx_r0.ticket()) == null ? null : tmp_4_0.status) === "USADO_COMIDA")("status-anulado", ((tmp_5_0 = ctx_r0.ticket()) == null ? null : tmp_5_0.status) === "ANULADO");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", ((tmp_6_0 = ctx_r0.ticket()) == null ? null : tmp_6_0.status) === "VENDIDO" ? "BONO ACTIVO / PENDIENTE DE USO" : ((tmp_6_0 = ctx_r0.ticket()) == null ? null : tmp_6_0.status) === "USADO_ENTRADA" ? "ENTRADA VALIDADA" : ((tmp_6_0 = ctx_r0.ticket()) == null ? null : tmp_6_0.status) === "USADO_COMIDA" ? "ENTRADA Y COMIDA ENTREGADAS" : "BONO ANULADO E INVALIDEZ", " ");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate((tmp_7_0 = ctx_r0.ticket()) == null ? null : tmp_7_0.four_digit_code);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r0.qrDataUrl());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.qrDataUrl());
    \u0275\u0275advance(9);
    \u0275\u0275textInterpolate((tmp_10_0 = ctx_r0.ticket()) == null ? null : tmp_10_0.buyer_name);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate((tmp_11_0 = ctx_r0.ticket()) == null ? null : tmp_11_0.seller_name);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(58, 24, (tmp_12_0 = ctx_r0.ticket()) == null ? null : tmp_12_0.created_at, "medium"));
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", ((tmp_13_0 = ctx_r0.ticket()) == null ? null : tmp_13_0.ticket_type) === "CON_COMIDA" ? "CON COMIDA" : "SIMPLE (Solo Entrada)", " ");
    \u0275\u0275advance(8);
    \u0275\u0275classProp("text-comida", (tmp_14_0 = ctx_r0.ticket()) == null ? null : tmp_14_0.includes_food);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ((tmp_15_0 = ctx_r0.ticket()) == null ? null : tmp_15_0.includes_food) ? "Incluye 1 Men\xFA (Chorip\xE1n)" : "No incluye men\xFA", " ");
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1("$", \u0275\u0275pipeBind2(83, 27, (tmp_16_0 = ctx_r0.ticket()) == null ? null : tmp_16_0.price_paid, "1.2-2"), "");
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate((tmp_17_0 = ctx_r0.ticket()) == null ? null : tmp_17_0.four_digit_code);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", (tmp_18_0 = ctx_r0.ticket()) == null ? null : tmp_18_0.includes_food);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1(" ", ctx_r0.copiedUrl() ? "\xA1Enlace Copiado! \u2713" : "Copiar Enlace para Compartir", " ");
  }
}
var PublicTicketViewComponent = class _PublicTicketViewComponent {
  route = inject(ActivatedRoute);
  apiService = inject(ApiService);
  loading = signal(true);
  errorMessage = signal("");
  ticket = signal(null);
  copiedUrl = signal(false);
  qrDataUrl = signal("");
  ngOnInit() {
    const token = this.route.snapshot.paramMap.get("token");
    if (!token) {
      this.loading.set(false);
      this.errorMessage.set("Token p\xFAblico no proporcionado en la URL");
      return;
    }
    this.fetchTicket(token);
  }
  fetchTicket(token) {
    this.loading.set(true);
    this.errorMessage.set("");
    this.apiService.getPublicTicketRaw(token).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.ticket.set(res.data);
          this.generateQrCode(res.data.four_digit_code);
        } else {
          this.errorMessage.set(res.error || "Bono / Ticket no encontrado o inactivo");
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.error || "No se pudo cargar la informaci\xF3n p\xFAblica del ticket");
      }
    });
  }
  generateQrCode(code) {
    if (!code)
      return;
    import_qrcode.default.toDataURL(code, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 260,
      color: {
        dark: "#1a101f",
        light: "#ffffff"
      }
    }).then((url) => {
      this.qrDataUrl.set(url);
    }).catch((err) => {
      console.error("Error generating QR code:", err);
    });
  }
  copyUrl() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.copiedUrl.set(true);
      setTimeout(() => this.copiedUrl.set(false), 2500);
    });
  }
  printTicket() {
    window.print();
  }
  static \u0275fac = function PublicTicketViewComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PublicTicketViewComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PublicTicketViewComponent, selectors: [["app-public-ticket-view"]], decls: 4, vars: 3, consts: [[1, "public-ticket-container"], [4, "ngIf"], ["class", "neu-card state-card error-card", 4, "ngIf"], ["class", "ticket-card neu-card", 4, "ngIf"], [1, "neu-card", "state-card", "error-card"], [1, "state-icon"], ["viewBox", "0 0 24 24", 1, "icon"], ["d", "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"], ["x1", "12", "y1", "9", "x2", "12", "y2", "13"], ["x1", "12", "y1", "17", "x2", "12.01", "y2", "17"], [1, "error-msg"], ["routerLink", "/", 1, "neu-btn", "neu-btn-bordo"], [1, "ticket-card", "neu-card"], [1, "ticket-header-banner"], [1, "event-brand"], ["src", "assets/logo-seminario-removebg-preview.png", "alt", "Logo Pe\xF1a", 1, "ticket-logo-img"], [1, "event-tagline"], [1, "ticket-number-badge", "neu-card"], [1, "status-banner"], [1, "status-icon"], ["cx", "12", "cy", "12", "r", "8"], [1, "status-text"], [1, "status-sub"], [1, "code-qr-section", "neu-card"], [1, "code-box"], [1, "code-label"], [1, "four-code"], [1, "code-hint"], [1, "qr-box"], ["class", "qr-img-wrapper", 4, "ngIf"], ["class", "qr-placeholder", 4, "ngIf"], [1, "info-grid"], [1, "info-item", "neu-card"], [1, "info-label"], ["d", "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"], ["cx", "12", "cy", "7", "r", "4"], [1, "info-value"], ["d", "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"], ["x1", "7", "y1", "7", "x2", "7.01", "y2", "7"], ["x", "3", "y", "4", "width", "18", "height", "18", "rx", "2", "ry", "2"], ["x1", "16", "y1", "2", "x2", "16", "y2", "6"], ["x1", "8", "y1", "2", "x2", "8", "y2", "6"], ["x1", "3", "y1", "10", "x2", "21", "y2", "10"], ["d", "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"], [1, "info-value", "highlight-type"], ["d", "M3 11h18"], ["d", "M5 11C5 7.13 8.13 4 12 4s7 3.13 7 7"], ["d", "M4 15h16a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a1 1 0 0 1 1-1z"], ["x1", "12", "y1", "1", "x2", "12", "y2", "23"], ["d", "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"], [1, "info-value", "price-tag"], [1, "instructions-box", "neu-card"], [1, "ticket-actions"], [1, "neu-btn", "neu-btn-bordo", "btn-action", 3, "click"], ["x", "9", "y", "9", "width", "13", "height", "13", "rx", "2", "ry", "2"], ["d", "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"], [1, "neu-btn", "btn-action", 3, "click"], ["points", "6 9 6 2 18 2 18 9"], ["d", "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"], ["x", "6", "y", "14", "width", "12", "height", "8"], [1, "qr-img-wrapper"], [1, "qr-code-img", 3, "src", "alt"], [1, "qr-text"], [1, "qr-placeholder"], [1, "qr-icon"], ["x", "5", "y", "2", "width", "14", "height", "20", "rx", "2", "ry", "2"], ["x1", "12", "y1", "18", "x2", "12.01", "y2", "18"]], template: function PublicTicketViewComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275template(1, PublicTicketViewComponent_ng_container_1_Template, 2, 0, "ng-container", 1)(2, PublicTicketViewComponent_div_2_Template, 12, 1, "div", 2)(3, PublicTicketViewComponent_div_3_Template, 110, 30, "div", 3);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading() && ctx.errorMessage());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading() && ctx.ticket());
    }
  }, dependencies: [CommonModule, NgIf, DecimalPipe, DatePipe, RouterLink, SkeletonLoaderComponent], styles: ["\n\n.public-ticket-container[_ngcontent-%COMP%] {\n  max-width: 800px;\n  margin: 2rem auto;\n  padding: 0 1.5rem;\n}\n.ticket-card[_ngcontent-%COMP%] {\n  border-top: 4px solid var(--color-gold, #D4AF37);\n  padding: 2.5rem 2rem;\n}\n.ticket-header-banner[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 2rem;\n  padding-bottom: 1.25rem;\n  border-bottom: 2px solid var(--color-gold, #D4AF37);\n}\n.event-brand[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.8rem;\n}\n.event-emoji[_ngcontent-%COMP%] {\n  font-size: 2.2rem;\n}\n.ticket-logo-img[_ngcontent-%COMP%] {\n  width: 90px;\n  height: 90px;\n  object-fit: contain;\n  filter: drop-shadow(0 4px 10px rgba(122, 0, 30, 0.15));\n}\n.event-brand[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  margin: 0;\n}\n.event-tagline[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: var(--text-secondary);\n}\n.ticket-number-badge[_ngcontent-%COMP%] {\n  font-family: var(--font-heading);\n  font-weight: 700;\n  color: var(--color-bordo);\n  font-size: 1.1rem;\n  padding: 0.5rem 1rem;\n}\n.status-banner[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 1.2rem;\n  border-radius: var(--radius-sm);\n  margin-bottom: 2rem;\n}\n.status-icon[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n}\n.status-text[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.status-sub[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n}\n.status-vendido[_ngcontent-%COMP%] {\n  background: rgba(34, 197, 94, 0.12);\n  color: #15803d;\n  border: 1px solid rgba(34, 197, 94, 0.3);\n}\n.status-entrada[_ngcontent-%COMP%], \n.status-comida[_ngcontent-%COMP%] {\n  background: rgba(37, 99, 235, 0.12);\n  color: #1d4ed8;\n  border: 1px solid rgba(37, 99, 235, 0.3);\n}\n.status-anulado[_ngcontent-%COMP%] {\n  background: rgba(239, 68, 68, 0.12);\n  color: #b91c1c;\n  border: 1px solid rgba(239, 68, 68, 0.3);\n}\n.code-qr-section[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr auto;\n  gap: 2rem;\n  align-items: center;\n  margin-bottom: 2rem;\n  padding: 1.5rem;\n}\n.code-label[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  font-weight: 700;\n  color: var(--text-secondary);\n  letter-spacing: 0.05em;\n}\n.four-code[_ngcontent-%COMP%] {\n  font-size: 3.5rem;\n  font-family: monospace;\n  font-weight: 800;\n  color: var(--color-bordo);\n  letter-spacing: 0.3em;\n}\n.code-hint[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: var(--text-secondary);\n  margin-top: 0.4rem;\n}\n.qr-box[_ngcontent-%COMP%] {\n  width: 140px;\n  height: 140px;\n  background: #ffffff;\n  box-shadow: var(--neu-shadow-inset);\n  border-radius: var(--radius-sm);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0.4rem;\n}\n.qr-img-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n.qr-code-img[_ngcontent-%COMP%] {\n  width: 105px;\n  height: 105px;\n  object-fit: contain;\n  border-radius: 4px;\n}\n.qr-placeholder[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n}\n.qr-text[_ngcontent-%COMP%] {\n  font-size: 0.65rem;\n  color: var(--text-secondary);\n  margin-top: 0.2rem;\n  font-weight: 600;\n}\n.qr-icon[_ngcontent-%COMP%] {\n  font-size: 2.2rem;\n  display: block;\n}\n.info-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 1rem;\n  margin-bottom: 2rem;\n}\n.info-item[_ngcontent-%COMP%] {\n  padding: 1rem;\n  display: flex;\n  flex-direction: column;\n  gap: 0.2rem;\n}\n.info-label[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--text-secondary);\n}\n.info-value[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n  color: var(--text-primary);\n}\n.instructions-box[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n  padding: 1.5rem;\n}\n.instructions-box[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  margin-bottom: 0.75rem;\n}\n.instructions-box[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  padding-left: 1.25rem;\n  font-size: 0.9rem;\n  color: var(--text-secondary);\n  display: flex;\n  flex-direction: column;\n  gap: 0.4rem;\n}\n.ticket-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n}\n.btn-action[_ngcontent-%COMP%] {\n  flex: 1;\n  padding: 0.9rem;\n}\n@media (max-width: 600px) {\n  .ticket-header-banner[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 1rem;\n  }\n  .code-qr-section[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    text-align: center;\n  }\n  .qr-box[_ngcontent-%COMP%] {\n    margin: 0 auto;\n  }\n  .ticket-actions[_ngcontent-%COMP%] {\n    flex-direction: column;\n  }\n}\n/*# sourceMappingURL=public-ticket-view.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PublicTicketViewComponent, [{
    type: Component,
    args: [{ selector: "app-public-ticket-view", standalone: true, imports: [CommonModule, RouterLink, SkeletonLoaderComponent], template: `<div class="public-ticket-container">
  <!-- Loading State -->
  <ng-container *ngIf="loading()">
    <app-skeleton-loader></app-skeleton-loader>
  </ng-container>

  <!-- Error State -->
  <div *ngIf="!loading() && errorMessage()" class="neu-card state-card error-card">
    <div class="state-icon"><svg class="icon" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
    <h2>Bono No Disponible</h2>
    <p class="error-msg">{{ errorMessage() }}</p>
    <a routerLink="/" class="neu-btn neu-btn-bordo">Ir al Inicio</a>
  </div>

  <!-- Main Ticket View Card -->
  <div *ngIf="!loading() && ticket()" class="ticket-card neu-card">
    <!-- Header Banner -->
    <div class="ticket-header-banner">
      <div class="event-brand">
        <img src="assets/logo-seminario-removebg-preview.png" alt="Logo Pe\xF1a" class="ticket-logo-img">
        <div>
          <h1>Pe\xF1a Seminario 2026</h1>
          <p class="event-tagline">Seminario Mayor de C\xF3rdoba - Comprobante Oficial</p>
        </div>
      </div>
      <div class="ticket-number-badge neu-card">
        #Bono {{ ticket()?.ticket_number }}
      </div>
    </div>

    <!-- Status Banner -->
    <div
      class="status-banner"
      [class.status-vendido]="ticket()?.status === 'VENDIDO'"
      [class.status-entrada]="ticket()?.status === 'USADO_ENTRADA'"
      [class.status-comida]="ticket()?.status === 'USADO_COMIDA'"
      [class.status-anulado]="ticket()?.status === 'ANULADO'"
    >
      <span class="status-icon">
        <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>
      </span>
      <div class="status-text">
        <strong>
          {{
            ticket()?.status === 'VENDIDO' ? 'BONO ACTIVO / PENDIENTE DE USO' :
            ticket()?.status === 'USADO_ENTRADA' ? 'ENTRADA VALIDADA' :
            ticket()?.status === 'USADO_COMIDA' ? 'ENTRADA Y COMIDA ENTREGADAS' : 'BONO ANULADO E INVALIDEZ'
          }}
        </strong>
        <span class="status-sub">Estado actual registrado en el sistema</span>
      </div>
    </div>

    <!-- Code & QR Section -->
    <div class="code-qr-section neu-card">
      <div class="code-box">
        <span class="code-label">C\xD3DIGO DE VALIDACI\xD3N DE 4 D\xCDGITOS</span>
        <div class="four-code">{{ ticket()?.four_digit_code }}</div>
        <p class="code-hint">Presenta este c\xF3digo de 4 d\xEDgitos al ingresar o retirar tu comida</p>
      </div>

      <div class="qr-box">
        <div *ngIf="qrDataUrl()" class="qr-img-wrapper">
          <img [src]="qrDataUrl()" alt="C\xF3digo QR de Validaci\xF3n (C\xF3digo: {{ ticket()?.four_digit_code }})" class="qr-code-img">
          <span class="qr-text">C\xF3digo QR Oficial ({{ ticket()?.four_digit_code }})</span>
        </div>
        <div *ngIf="!qrDataUrl()" class="qr-placeholder">
          <span class="qr-icon"><svg class="icon" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></span>
          <span class="qr-text">Generando C\xF3digo QR...</span>
        </div>
      </div>
    </div>

    <!-- Main Information Grid -->
    <div class="info-grid">
      <div class="info-item neu-card">
        <span class="info-label"><svg class="icon" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Comprador:</span>
        <strong class="info-value">{{ ticket()?.buyer_name }}</strong>
      </div>

      <div class="info-item neu-card">
        <span class="info-label"><svg class="icon" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> Vendedor / Emisor:</span>
        <strong class="info-value">{{ ticket()?.seller_name }}</strong>
      </div>

      <div class="info-item neu-card">
        <span class="info-label"><svg class="icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Fecha de Compra:</span>
        <strong class="info-value">{{ ticket()?.created_at | date:'medium' }}</strong>
      </div>

      <div class="info-item neu-card">
        <span class="info-label"><svg class="icon" viewBox="0 0 24 24"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg> Tipo de Bono:</span>
        <strong class="info-value highlight-type">
          {{ ticket()?.ticket_type === 'CON_COMIDA' ? 'CON COMIDA' : 'SIMPLE (Solo Entrada)' }}
        </strong>
      </div>

      <div class="info-item neu-card">
        <span class="info-label"><svg class="icon" viewBox="0 0 24 24"><path d="M3 11h18"/><path d="M5 11C5 7.13 8.13 4 12 4s7 3.13 7 7"/><path d="M4 15h16a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a1 1 0 0 1 1-1z"/></svg> Almuerzo / Comida:</span>
        <strong class="info-value" [class.text-comida]="ticket()?.includes_food">
          {{ ticket()?.includes_food ? 'Incluye 1 Men\xFA (Chorip\xE1n)' : 'No incluye men\xFA' }}
        </strong>
      </div>

      <div class="info-item neu-card">
        <span class="info-label"><svg class="icon" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> Monto Pagado:</span>
        <strong class="info-value price-tag">\${{ ticket()?.price_paid | number:'1.2-2' }}</strong>
      </div>
    </div>

    <!-- Instructions Box -->
    <div class="instructions-box neu-card">
      <h3>Instrucciones Importantes para el Asistente</h3>
      <ul>
        <li>Guarda o captura la pantalla de este comprobante en tu dispositivo m\xF3vil.</li>
        <li>Al llegar al predio de la Pe\xF1a Seminario 2026, presenta el c\xF3digo de 4 d\xEDgitos (<strong>{{ ticket()?.four_digit_code }}</strong>) en el puesto de acceso.</li>
        <li *ngIf="ticket()?.includes_food">
          Tu ticket incluye <strong>1 chorip\xE1n</strong>. Para retirarlo, ac\xE9rcate al puesto gastron\xF3mico y presenta tu c\xF3digo de 4 d\xEDgitos.
        </li>
        <li>Este bono es personal e intransferible una vez validado por la organizaci\xF3n.</li>
      </ul>
    </div>

    <!-- Footer Actions -->
    <div class="ticket-actions">
      <button class="neu-btn neu-btn-bordo btn-action" (click)="copyUrl()">
        <svg class="icon" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> {{ copiedUrl() ? '\xA1Enlace Copiado! \u2713' : 'Copiar Enlace para Compartir' }}
      </button>

      <button class="neu-btn btn-action" (click)="printTicket()">
        <svg class="icon" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Imprimir / Guardar en PDF
      </button>
    </div>
  </div>
</div>
`, styles: ["/* src/app/features/tickets/public-ticket-view/public-ticket-view.component.css */\n.public-ticket-container {\n  max-width: 800px;\n  margin: 2rem auto;\n  padding: 0 1.5rem;\n}\n.ticket-card {\n  border-top: 4px solid var(--color-gold, #D4AF37);\n  padding: 2.5rem 2rem;\n}\n.ticket-header-banner {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 2rem;\n  padding-bottom: 1.25rem;\n  border-bottom: 2px solid var(--color-gold, #D4AF37);\n}\n.event-brand {\n  display: flex;\n  align-items: center;\n  gap: 0.8rem;\n}\n.event-emoji {\n  font-size: 2.2rem;\n}\n.ticket-logo-img {\n  width: 90px;\n  height: 90px;\n  object-fit: contain;\n  filter: drop-shadow(0 4px 10px rgba(122, 0, 30, 0.15));\n}\n.event-brand h1 {\n  font-size: 1.75rem;\n  margin: 0;\n}\n.event-tagline {\n  font-size: 0.85rem;\n  color: var(--text-secondary);\n}\n.ticket-number-badge {\n  font-family: var(--font-heading);\n  font-weight: 700;\n  color: var(--color-bordo);\n  font-size: 1.1rem;\n  padding: 0.5rem 1rem;\n}\n.status-banner {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 1.2rem;\n  border-radius: var(--radius-sm);\n  margin-bottom: 2rem;\n}\n.status-icon {\n  font-size: 1.8rem;\n}\n.status-text {\n  display: flex;\n  flex-direction: column;\n}\n.status-sub {\n  font-size: 0.8rem;\n}\n.status-vendido {\n  background: rgba(34, 197, 94, 0.12);\n  color: #15803d;\n  border: 1px solid rgba(34, 197, 94, 0.3);\n}\n.status-entrada,\n.status-comida {\n  background: rgba(37, 99, 235, 0.12);\n  color: #1d4ed8;\n  border: 1px solid rgba(37, 99, 235, 0.3);\n}\n.status-anulado {\n  background: rgba(239, 68, 68, 0.12);\n  color: #b91c1c;\n  border: 1px solid rgba(239, 68, 68, 0.3);\n}\n.code-qr-section {\n  display: grid;\n  grid-template-columns: 1fr auto;\n  gap: 2rem;\n  align-items: center;\n  margin-bottom: 2rem;\n  padding: 1.5rem;\n}\n.code-label {\n  font-size: 0.8rem;\n  font-weight: 700;\n  color: var(--text-secondary);\n  letter-spacing: 0.05em;\n}\n.four-code {\n  font-size: 3.5rem;\n  font-family: monospace;\n  font-weight: 800;\n  color: var(--color-bordo);\n  letter-spacing: 0.3em;\n}\n.code-hint {\n  font-size: 0.85rem;\n  color: var(--text-secondary);\n  margin-top: 0.4rem;\n}\n.qr-box {\n  width: 140px;\n  height: 140px;\n  background: #ffffff;\n  box-shadow: var(--neu-shadow-inset);\n  border-radius: var(--radius-sm);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0.4rem;\n}\n.qr-img-wrapper {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\n.qr-code-img {\n  width: 105px;\n  height: 105px;\n  object-fit: contain;\n  border-radius: 4px;\n}\n.qr-placeholder {\n  text-align: center;\n  font-size: 0.75rem;\n  color: var(--text-secondary);\n}\n.qr-text {\n  font-size: 0.65rem;\n  color: var(--text-secondary);\n  margin-top: 0.2rem;\n  font-weight: 600;\n}\n.qr-icon {\n  font-size: 2.2rem;\n  display: block;\n}\n.info-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 1rem;\n  margin-bottom: 2rem;\n}\n.info-item {\n  padding: 1rem;\n  display: flex;\n  flex-direction: column;\n  gap: 0.2rem;\n}\n.info-label {\n  font-size: 0.8rem;\n  color: var(--text-secondary);\n}\n.info-value {\n  font-size: 0.95rem;\n  color: var(--text-primary);\n}\n.instructions-box {\n  margin-bottom: 2rem;\n  padding: 1.5rem;\n}\n.instructions-box h3 {\n  font-size: 1.1rem;\n  margin-bottom: 0.75rem;\n}\n.instructions-box ul {\n  padding-left: 1.25rem;\n  font-size: 0.9rem;\n  color: var(--text-secondary);\n  display: flex;\n  flex-direction: column;\n  gap: 0.4rem;\n}\n.ticket-actions {\n  display: flex;\n  gap: 1rem;\n}\n.btn-action {\n  flex: 1;\n  padding: 0.9rem;\n}\n@media (max-width: 600px) {\n  .ticket-header-banner {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 1rem;\n  }\n  .code-qr-section {\n    grid-template-columns: 1fr;\n    text-align: center;\n  }\n  .qr-box {\n    margin: 0 auto;\n  }\n  .ticket-actions {\n    flex-direction: column;\n  }\n}\n/*# sourceMappingURL=public-ticket-view.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PublicTicketViewComponent, { className: "PublicTicketViewComponent", filePath: "src/app/features/tickets/public-ticket-view/public-ticket-view.component.ts", lineNumber: 15 });
})();
export {
  PublicTicketViewComponent
};
//# sourceMappingURL=chunk-OUVGDOWO.js.map
