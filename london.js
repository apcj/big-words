// Generated by CoffeeScript 1.7.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function() {
    var Graph, bigBenGraph, canaryWharfGraph, generateGraph, gherkinGraph, render, shardGraph, towerBridgeGraph, wheelGraph;
    Graph = (function() {
      function Graph() {
        this.scale = __bind(this.scale, this);
        this.translate = __bind(this.translate, this);
        this.circuit = __bind(this.circuit, this);
        this.connect = __bind(this.connect, this);
        this.relationship = __bind(this.relationship, this);
        this.node = __bind(this.node, this);
        this.nodes = [];
        this.relationships = [];
      }

      Graph.prototype.node = function(x, y) {
        var node;
        node = {
          x: x,
          y: y,
          radius: 7
        };
        this.nodes.push(node);
        return node;
      };

      Graph.prototype.relationship = function(source, target) {
        var relationship;
        relationship = {
          source: source,
          target: target
        };
        this.relationships.push(relationship);
        return relationship;
      };

      Graph.prototype.connect = function(nodes) {
        var i, _i, _ref;
        for (i = _i = 0, _ref = nodes.length - 2; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.relationship(nodes[i], nodes[i + 1]);
        }
        return nodes;
      };

      Graph.prototype.circuit = function(nodes) {
        this.connect(nodes);
        return this.relationship(nodes[nodes.length - 1], nodes[0]);
      };

      Graph.prototype.translate = function(dx, dy) {
        var node, _i, _len, _ref;
        _ref = this.nodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          node.x += dx;
          node.y += dy;
        }
        return this;
      };

      Graph.prototype.scale = function(factor) {
        var node, _i, _len, _ref;
        _ref = this.nodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          node.x *= factor;
          node.y *= factor;
          node.radius *= factor;
        }
        return this;
      };

      Graph.prototype.merge = function(o) {
        this.relationships = this.relationships.concat(o.relationships);
        return this.nodes = this.nodes.concat(o.nodes);
      };

      return Graph;

    })();
    render = function(g, svg) {
      var circles, container, lines;
      svg.selectAll('image').data([
        {
          href: 'file:///Users/apcj/projects/apcj/big-words/images/neo4j_logo.png',
          x: 595,
          y: 9,
          width: 175,
          height: 70
        }, {
          href: 'file:///Users/apcj/projects/apcj/big-words/images/london_user_group.png',
          x: 650,
          y: 61,
          width: 270,
          height: 43
        }
      ]).enter().append("svg:image").attr('x', function(d) {
        return d.x;
      }).attr('y', function(d) {
        return d.y;
      }).attr('width', function(d) {
        return d.width;
      }).attr('height', function(d) {
        return d.height;
      }).attr("xlink:href", function(d) {
        return d.href;
      });
      container = svg.selectAll('g').data([g]);
      container.enter().append('g');
      lines = container.selectAll('path').data(g.relationships);
      lines.enter().append('path').attr('fill', 'black').attr('stroke', 'none');
      lines.attr('d', function(d) {
        var dx, dy, length;
        dx = d.target.x - d.source.x;
        dy = d.target.y - d.source.y;
        length = Math.sqrt(dx * dx + dy * dy);
        if (d.deflection != null) {
          return new neo.utils.arcArrow(d.source.radius, d.target.radius, length, d.deflection, 0.5, 3, 4, 'internal').outline(0);
        } else {
          return new neo.utils.straightArrow(d.source.radius, d.target.radius, length, 0.5, 3, 4, 'internal').outline(0);
        }
      }).attr('transform', function(d) {
        var dx, dy;
        dx = d.target.x - d.source.x;
        dy = d.target.y - d.source.y;
        return "translate(" + d.source.x + ", " + d.source.y + ") rotate(" + (Math.atan2(dy, dx) * 180 / Math.PI) + ")";
      });
      circles = container.selectAll('circle').data(g.nodes);
      circles.enter().append('circle').attr('r', function(d) {
        return d.radius;
      }).attr('fill', 'white').attr('stroke', 'black').attr('stroke-width', 1);
      return circles.attr('cx', function(d) {
        return d.x;
      }).attr('cy', function(d) {
        return d.y;
      });
    };
    wheelGraph = function(time) {
      var angle, capsule, clearance, g, hub, i, previousNode, spokeCount, spread, wheelRadius, _i, _ref;
      g = new Graph();
      hub = g.node(0, 0);
      spokeCount = 20;
      wheelRadius = 150;
      spread = wheelRadius / 5;
      clearance = wheelRadius / 10;
      previousNode = null;
      for (i = _i = 0, _ref = spokeCount - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        angle = Math.PI * 2 * ((i / spokeCount) + (time / 20000));
        capsule = g.node(wheelRadius * Math.cos(angle), wheelRadius * Math.sin(angle));
        g.relationship(hub, capsule);
        if (previousNode) {
          g.relationship(previousNode, capsule);
        }
        previousNode = capsule;
      }
      g.relationship(previousNode, g.nodes[1]);
      g.relationship(g["in"] = g.node(-spread, wheelRadius + clearance), hub);
      g.relationship(hub, g.out = g.node(spread, wheelRadius + clearance));
      return g;
    };
    gherkinGraph = function() {
      var bottomRow, columns, d, g, highRow, ignored, joinUp, lowRow, rows, spacing, w, x, y, _i, _j, _k, _l, _len, _len1, _m, _n, _ref, _ref1, _results;
      g = new Graph();
      spacing = 40;
      rows = [];
      d = 4;
      w = 2;
      for (y = _i = -d; -d <= d ? _i <= d : _i >= d; y = -d <= d ? ++_i : --_i) {
        columns = y % 2 === 0 ? (function() {
          _results = [];
          for (var _j = -w; -w <= w ? _j <= w : _j >= w; -w <= w ? _j++ : _j--){ _results.push(_j); }
          return _results;
        }).apply(this) : (function() {
          var _k, _ref, _results1;
          _results1 = [];
          for (x = _k = _ref = -w + 1; _ref <= w ? _k <= w : _k >= w; x = _ref <= w ? ++_k : --_k) {
            _results1.push(x - .5);
          }
          return _results1;
        })();
        rows.push(columns.map(function(x) {
          return g.node(spacing * x * Math.cos(y / 4), spacing * y);
        }));
      }
      for (y = _k = 0, _ref = rows.length - 3; _k <= _ref; y = _k += 2) {
        g.relationship(rows[y + 2][0], rows[y][0]);
        g.relationship(rows[y + 2][rows[y + 2].length - 1], rows[y][rows[y].length - 1]);
      }
      for (y = _l = 1, _ref1 = rows.length - 1; 1 <= _ref1 ? _l <= _ref1 : _l >= _ref1; y = 1 <= _ref1 ? ++_l : --_l) {
        highRow = rows[y - 1];
        lowRow = rows[y];
        if (lowRow.length < highRow.length) {
          for (x = _m = 0, _len = lowRow.length; _m < _len; x = ++_m) {
            ignored = lowRow[x];
            g.relationship(highRow[x], lowRow[x]);
            g.relationship(lowRow[x], highRow[x + 1]);
          }
        } else {
          for (x = _n = 0, _len1 = highRow.length; _n < _len1; x = ++_n) {
            ignored = highRow[x];
            g.relationship(lowRow[x], highRow[x]);
            g.relationship(highRow[x], lowRow[x + 1]);
          }
        }
      }
      joinUp = function(row) {
        var _o, _ref2, _results1;
        _results1 = [];
        for (x = _o = 0, _ref2 = row.length - 2; 0 <= _ref2 ? _o <= _ref2 : _o >= _ref2; x = 0 <= _ref2 ? ++_o : --_o) {
          _results1.push(g.relationship(row[x], row[x + 1]));
        }
        return _results1;
      };
      joinUp(rows[0]);
      bottomRow = rows[rows.length - 1];
      joinUp(bottomRow);
      g["in"] = bottomRow[0];
      g.out = bottomRow[bottomRow.length - 1];
      g.relationship(rows[0][0], rows[0][rows[0].length - 1]).deflection = -60;
      return g;
    };
    bigBenGraph = function() {
      var corner, face, faceBottom, faceBox, faceTop, g, levels, reflectedNodes, tip, y, _i, _j, _len, _ref, _ref1;
      g = new Graph();
      reflectedNodes = function(x, y) {
        var left, right;
        left = g.node(-x, y);
        right = g.node(x, y);
        g.relationship(left, right);
        return [left, right];
      };
      faceTop = null;
      faceBottom = null;
      faceBox = 30;
      levels = [reflectedNodes(faceBox * 3 / 5, -faceBox * 12 / 5), reflectedNodes(faceBox * 3 / 5, -faceBox * 2), faceTop = reflectedNodes(faceBox, -faceBox), faceBottom = reflectedNodes(faceBox, faceBox), [g["in"] = g.node(-faceBox, faceBox * 7), g.out = g.node(faceBox, faceBox * 7)]];
      tip = g.node(0, -faceBox * 4);
      g.relationship(tip, levels[0][0]);
      g.relationship(tip, levels[0][1]);
      face = g.node(0, 0);
      face.radius = faceBox * 4 / 5;
      _ref = faceTop.concat(faceBottom);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        corner = _ref[_i];
        g.relationship(face, corner);
      }
      for (y = _j = 0, _ref1 = levels.length - 2; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
        g.relationship(levels[y][0], levels[y + 1][0]);
        g.relationship(levels[y][1], levels[y + 1][1]);
      }
      return g;
    };
    shardGraph = function() {
      var column, columns, g, node, previous, size, x, y, _i, _j, _k, _ref, _ref1;
      g = new Graph();
      size = 4;
      columns = [];
      for (x = _i = -size; -size <= size ? _i <= size : _i >= size; x = -size <= size ? ++_i : --_i) {
        previous = null;
        columns.push(column = []);
        for (y = _j = _ref = Math.abs(x); _ref <= size ? _j <= size : _j >= size; y = _ref <= size ? ++_j : --_j) {
          column.push(node = g.node(x * 15, y * 90));
          if (previous) {
            g.relationship(previous, node);
          }
          previous = node;
        }
      }
      for (x = _k = 0, _ref1 = columns.length - 2; 0 <= _ref1 ? _k <= _ref1 : _k >= _ref1; x = 0 <= _ref1 ? ++_k : --_k) {
        g.relationship(columns[x][0], columns[x + 1][0]);
      }
      g["in"] = columns[0][0];
      g.out = columns[columns.length - 1][0];
      return g;
    };
    towerBridgeGraph = function() {
      var a1, a2, a3, a4, angle, b1, b2, b3, b4, d, g, gw, h, p, sh, sw, tw;
      tw = 12;
      gw = 90;
      sw = 100;
      h = 130;
      d = 30;
      p = 20;
      sh = 20;
      g = new Graph();
      g["in"] = g.node(-gw - sw, 0);
      g.out = g.node(gw + sw, 0);
      g.circuit([g.node(-gw - tw, d), b1 = g.node(-gw - tw, 0), a1 = g.node(-gw - tw, -h), g.node(-gw - tw, -h - p), g.node(-gw, -h - p - sh), g.node(-gw + tw, -h - p), a2 = g.node(-gw + tw, -h), b2 = g.node(-gw + tw, 0), g.node(-gw + tw, d)]);
      g.circuit([g.node(gw - tw, d), b3 = g.node(gw - tw, 0), a3 = g.node(gw - tw, -h), g.node(gw - tw, -h - p), g.node(gw, -h - p - sh), g.node(gw + tw, -h - p), a4 = g.node(gw + tw, -h), b4 = g.node(gw + tw, 0), g.node(gw + tw, d)]);
      g.relationship(g["in"], a1);
      g.relationship(g["in"], b1);
      g.relationship(a2, a3);
      g.relationship(a4, g.out);
      g.relationship(b4, g.out);
      angle = 45 * Math.PI / 180;
      g.relationship(b2, g.node(-gw + tw + gw * Math.sin(angle), -gw * Math.cos(angle)));
      g.relationship(b3, g.node(gw - tw - gw * Math.sin(angle), -gw * Math.cos(angle)));
      return g;
    };
    canaryWharfGraph = function() {
      var g, gap, h1, h2, i, outline, w1, w2, _i, _ref;
      g = new Graph();
      h1 = 320;
      h2 = 270;
      w1 = 40;
      w2 = 33;
      gap = 30;
      outline = [g["in"] = g.node(-w1 - w2 * 2 - gap, 0), g.node(-w1 - w2 * 2 - gap, -h2), g.node(-w1 - gap, -h2), g.node(-w1 - gap, 0), g.node(-w1, 0), g.node(-w1, -h1), g.node(0, -h1 - w1), g.node(w1, -h1), g.node(w1, 0), g.node(w1 + gap, 0), g.node(w1 + gap, -h2), g.node(w1 + w2 * 2 + gap, -h2), g.out = g.node(w1 + w2 * 2 + gap, 0)];
      for (i = _i = 0, _ref = outline.length - 2; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        g.relationship(outline[i], outline[i + 1]);
      }
      return g;
    };
    generateGraph = function(time) {
      var g, landmark, landmarks, out, _i, _len;
      g = new Graph();
      landmarks = [bigBenGraph().translate(100, 295), wheelGraph(time).translate(320, 340), gherkinGraph().translate(600, 345), shardGraph().translate(800, 145), towerBridgeGraph().translate(1100, 505), canaryWharfGraph().translate(1450, 505)];
      out = g.node(0, 505);
      for (_i = 0, _len = landmarks.length; _i < _len; _i++) {
        landmark = landmarks[_i];
        g.merge(landmark);
        if (landmark["in"]) {
          g.relationship(out, landmark["in"]);
        }
        out = landmark.out;
      }
      g.relationship(out, g.node(2742, 505));
      return g.scale(0.35).translate(0, -42);
    };
    window.generateGraph = generateGraph;
    window.render = render;
    return d3.selectAll('div.slide').each(function() {
      var svg;
      svg = d3.select(this).append('svg').attr('class', 'fill');
      return d3.timer(function(time) {
        var graph;
        graph = generateGraph(time);
        render(graph, svg);
        return false;
      });
    });
  })();

}).call(this);
