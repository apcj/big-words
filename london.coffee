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
      @nodes.push node
      node
    relationship: (source, target) =>
      relationship =
        source: source
        target: target
      @relationships.push relationship
      relationship
    merge: (o) ->
      @relationships = @relationships.concat o.relationships
      @nodes = @nodes.concat o.nodes

  render = (g, container) ->
    lines = container.selectAll('path').data(g.relationships)

    lines.enter().append('path')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('marker-end', 'url(#markerArrow)')

    lines
    .attr('d', (d) ->
      if d.arcRatio?
        dx = d.target.x - d.source.x
        dy = d.target.y - d.source.y
        length = Math.sqrt(dx * dx + dy * dy)
        arcRadius = length * d.arcRatio / 2
        ['M', d.source.x, d.source.y, 'A', arcRadius, arcRadius, 0, 0, 1, d.target.x, d.target.y].join(' ')
      else
        ['M', d.source.x, d.source.y, 'L', d.target.x, d.target.y].join(' ')
    )

    circles = container.selectAll('circle').data(g.nodes)

    circles.enter().append('circle')
    .attr('r', (d) -> d.radius ? 7)
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
      angle = (i * Math.PI * 2 / spokeCount + time / 10000) % 360
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

    g.relationship(rows[0][0], rows[0][rows[0].length - 1]).arcRatio = 1.03

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
    size = 5

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

  canaryWharfGraph = ->
    g = new Graph()
    h1 = 350
    h2 = 300
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

  translate = (g, dx, dy) ->
    for node in g.nodes
      node.x += dx
      node.y += dy
    g

  d3.selectAll('div.slide').each ->
    svg = d3.select(this).append('svg')
    .attr('class', 'fill')

    svg.append('defs')
    .append('marker')
    .attr('id', 'markerArrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 20)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')

    container = svg.append('g')

    generateGraph = (time) ->
      g = new Graph()
      landmarks = [
        translate(bigBenGraph(), 100, 295)
        translate(wheelGraph(time), 320, 340)
        translate(gherkinGraph(), 600, 345)
        translate(shardGraph(), 800, 55)
        translate(canaryWharfGraph(), 1050, 505)
      ]
      out = null
      for landmark in landmarks
        g.merge(landmark)
        if out and landmark.in
          console.log landmark.in.y
          g.relationship(out, landmark.in)
        out = landmark.out
      g

    d3.timer (time) ->
      graph = generateGraph time
      render graph, container
      false