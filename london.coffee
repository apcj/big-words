---
---

dummyStatementToHelpIntelliJWithPreamble = true

do ->

  class Graph
    constructor: ->
      @nodes = []
      @relationships = []
    node: (x, y) =>
      node =
        x: x
        y: y
        radius: 7
      @nodes.push node
      node
    relationship: (source, target) =>
      relationship =
        source: source
        target: target
      @relationships.push relationship
      relationship
    connect: (nodes) =>
      for i in [0..nodes.length - 2]
        @relationship(nodes[i], nodes[i + 1])
      nodes
    circuit: (nodes) =>
      @connect(nodes)
      @relationship(nodes[nodes.length - 1], nodes[0])
    translate: (dx, dy) =>
      for node in @nodes
        node.x += dx
        node.y += dy
      @
    scale: (factor) =>
      for node in @nodes
        node.x *= factor
        node.y *= factor
        node.radius *= factor
      @
    merge: (o) ->
      @relationships = @relationships.concat o.relationships
      @nodes = @nodes.concat o.nodes

  render = (g, svg) ->
#    svg.selectAll('rect').data([true])
#    .enter()
#    .append('rect')
#    .attr('width', 960)
#    .attr('height', 117)
#    .attr('stroke-width', 1)
#    .attr('stroke', 'black')
#    .attr('fill', 'none')

    container = svg.selectAll('g').data([g])

    container
    .enter()
    .append('g')

    lines = container.selectAll('path').data(g.relationships)

    lines.enter().append('path')
    .attr('fill', 'black')
    .attr('stroke', 'none')

    lines
    .attr('d', (d) ->
      dx = d.target.x - d.source.x
      dy = d.target.y - d.source.y
      length = Math.sqrt(dx * dx + dy * dy)
      if d.deflection?
        new neo.utils.arcArrow(d.source.radius, d.target.radius, length, d.deflection, 0.5, 3, 4, 'internal').outline(0)
      else
        new neo.utils.straightArrow(d.source.radius, d.target.radius, length, 0.5, 3, 4, 'internal').outline(0)
    )
    .attr('transform', (d) ->
        dx = d.target.x - d.source.x
        dy = d.target.y - d.source.y
        "translate(#{d.source.x}, #{d.source.y}) rotate(#{Math.atan2(dy, dx) * 180 / Math.PI})"
    );

    circles = container.selectAll('circle').data(g.nodes)

    circles.enter().append('circle')
    .attr('r', (d) -> d.radius)
    .attr('fill', 'white')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)

    circles
    .attr('cx', (d) -> d.x)
    .attr('cy', (d) -> d.y)

  wheelGraph = (time) ->
    g = new Graph()
    hub = g.node(0, 0)
    spokeCount = 20
    wheelRadius = 150
    spread = wheelRadius / 5
    clearance = wheelRadius / 10
    previousNode = null
    for i in [0..spokeCount - 1]
      angle = Math.PI * 2 * ((i / spokeCount) + (time / 20000))
      capsule = g.node(wheelRadius * Math.cos(angle), wheelRadius * Math.sin(angle))
      g.relationship(hub, capsule)
      if previousNode
        g.relationship(previousNode, capsule)
      previousNode = capsule
    g.relationship(previousNode, g.nodes[1])
    g.relationship(g.in = g.node(-spread, wheelRadius + clearance), hub)
    g.relationship(hub, g.out = g.node(spread, wheelRadius + clearance))
    g

  gherkinGraph = ->
    g = new Graph()
    spacing = 40
    rows = []
    d = 4
    w = 2
    for y in [-d..d]
      columns = if y % 2 is 0
        [-w..w]
      else
        (x - .5 for x in [-w + 1..w])
      rows.push columns.map (x) ->
        g.node(spacing * x * Math.cos(y / 4), spacing * y)

    for y in [0..rows.length - 3] by 2
      g.relationship(rows[y + 2][0], rows[y][0])
      g.relationship(rows[y + 2][rows[y + 2].length - 1], rows[y][rows[y].length - 1])

    for y in [1..rows.length - 1]
      highRow = rows[y - 1]
      lowRow = rows[y]
      if lowRow.length < highRow.length
        for ignored, x in lowRow
          g.relationship(highRow[x], lowRow[x])
          g.relationship(lowRow[x], highRow[x + 1])
      else
        for ignored, x in highRow
          g.relationship(lowRow[x], highRow[x])
          g.relationship(highRow[x], lowRow[x + 1])

    joinUp = (row) ->
      for x in [0..row.length - 2]
        g.relationship(row[x], row[x + 1])

    joinUp rows[0]
    bottomRow = rows[rows.length - 1]
    joinUp bottomRow
    g.in = bottomRow[0]
    g.out = bottomRow[bottomRow.length - 1]

    g.relationship(rows[0][0], rows[0][rows[0].length - 1]).deflection = -60

    g

  bigBenGraph = ->
    g = new Graph()

    reflectedNodes = (x, y) ->
      left = g.node(-x, y)
      right = g.node(x, y)
      g.relationship(left, right)
      [left, right]

    faceTop = null
    faceBottom = null
    faceBox = 30

    levels = [
      reflectedNodes faceBox * 3 / 5, -faceBox * 12 / 5
      reflectedNodes faceBox * 3 / 5, -faceBox * 2
      faceTop = reflectedNodes faceBox, -faceBox
      faceBottom = reflectedNodes faceBox, faceBox
      [g.node(-faceBox, faceBox * 7), g.out = g.node(faceBox, faceBox * 7)]
    ]
    tip = g.node(0, -faceBox * 4)
    g.relationship(tip, levels[0][0])
    g.relationship(tip, levels[0][1])
    face = g.node(0, 0)
    face.radius = faceBox * 4 / 5
    for corner in faceTop.concat faceBottom
      g.relationship(face, corner)

    for y in [0..levels.length - 2]
      g.relationship(levels[y][0], levels[y + 1][0])
      g.relationship(levels[y][1], levels[y + 1][1])
    g

  shardGraph = ->
    g = new Graph()
    size = 4

    columns = []

    for x in [-size..size]
      previous = null
      columns.push column = []
      for y in [Math.abs(x)..size]
        column.push node = g.node(x * 15, y * 90)
        if previous
          g.relationship(previous, node)
        previous = node

    for x in [0..columns.length - 2]
      g.relationship(columns[x][0], columns[x + 1][0])

    g.in = columns[0][0]
    g.out = columns[columns.length - 1][0]
    g

  towerBridgeGraph = ->
    tw = 12
    gw = 90
    sw = 100
    h = 130
    d = 30
    p = 20
    sh = 20
    g = new Graph()
    g.in = g.node(-gw - sw, 0)
    g.out = g.node(gw + sw, 0)
    g.circuit [
      g.node(-gw - tw, d)
      b1 = g.node(-gw - tw, 0)
      a1 = g.node(-gw - tw, -h)
      g.node(-gw - tw, -h - p)
      g.node(-gw, -h - p - sh)
      g.node(-gw + tw, -h - p)
      a2 = g.node(-gw + tw, -h)
      b2 = g.node(-gw + tw, 0)
      g.node(-gw + tw, d)
    ]
    g.circuit [
      g.node(gw - tw, d)
      b3 = g.node(gw - tw, 0)
      a3 = g.node(gw - tw, -h)
      g.node(gw - tw, -h - p)
      g.node(gw, -h - p - sh)
      g.node(gw + tw, -h - p)
      a4 = g.node(gw + tw, -h)
      b4 = g.node(gw + tw, 0)
      g.node(gw + tw, d)
    ]
    g.relationship(g.in, a1)
    g.relationship(g.in, b1)
    g.relationship(a2, a3)
    g.relationship(a4, g.out)
    g.relationship(b4, g.out)
    angle = 45 * Math.PI / 180
    g.relationship(b2, g.node(-gw + tw + gw * Math.sin(angle), -gw * Math.cos(angle)))
    g.relationship(b3, g.node(gw - tw - gw * Math.sin(angle), -gw * Math.cos(angle)))
    g

  canaryWharfGraph = ->
    g = new Graph()
    h1 = 330
    h2 = 280
    w1 = 40
    w2 = 33
    gap = 30

    outline = [
      g.in = g.node(-w1 - w2 * 2 - gap, 0)
      g.node(-w1 - w2 * 2 - gap, -h2)
      g.node(-w1 - gap, -h2)
      g.node(-w1 - gap, 0)
      g.node(-w1, 0)
      g.node(-w1, -h1)
      g.node(0, -h1 - w1)
      g.node(w1, -h1)
      g.node(w1, 0)
      g.node(w1 + gap, 0)
      g.node(w1 + gap, -h2)
      g.node(w1 + w2 * 2 + gap, -h2)
      g.node(w1 + w2 * 2 + gap, 0)
    ]

    for i in [0..outline.length - 2]
      g.relationship(outline[i], outline[i + 1])
    g

  generateGraph = (time) ->
    g = new Graph()
    landmarks = [
      bigBenGraph().translate(100, 295)
      wheelGraph(time).translate(320, 340)
      gherkinGraph().translate(600, 345)
      shardGraph().translate(800, 145)
      towerBridgeGraph().translate(1100, 505)
      canaryWharfGraph().translate(1450, 505)
    ]
    out = null
    for landmark in landmarks
      g.merge(landmark)
      if out and landmark.in
        g.relationship(out, landmark.in)
      out = landmark.out
    g.scale(0.3).translate(0, -37)

  window.generateGraph = generateGraph
  window.render = render

  d3.selectAll('div.slide').each ->
    svg = d3.select(this).append('svg')
    .attr('class', 'fill')

    d3.timer (time) ->
      graph = generateGraph time
      render graph, svg
      false