---
---

dummyStatementToHelpIntelliJWithPreamble = true

do ->
  drawGraph = (nodes, relationships, container) ->
    lines = container.selectAll('path').data(relationships)

    lines.enter().append('path')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('marker-end', 'url(#markerArrow)')

    lines
    .attr('d', (d) -> ['M', d.source.x, d.source.y, 'L', d.target.x, d.target.y].join(' '))

    circles = container.selectAll('circle').data(nodes)

    circles.enter().append('circle')
    .attr('r', 7)
    .attr('fill', 'white')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)

    circles
    .attr('cx', (d) -> d.x)
    .attr('cy', (d) -> d.y)

  drawWheel = (svg) ->
    nodes = []
    relationships = []
    hub =
      x: 0
      y: 0
    nodes.push hub
    spokeCount = 20
    wheelRadius = 100
    previousNode = null
    for i in [0..spokeCount - 1]
      angle = i * Math.PI * 2 / spokeCount
      node =
        x: wheelRadius * Math.cos(angle)
        y: wheelRadius * Math.sin(angle)
      nodes.push node
      relationships.push
        source: hub
        target: node
      if previousNode
        relationships.push
          source: previousNode
          target: node
      previousNode = node

    if previousNode
      relationships.push
        source: previousNode
        target: nodes[1]

    wheelGroup = svg.append('g')

    drawGraph nodes, relationships, wheelGroup

    d3.timer (time) ->
      wheelGroup
      .attr('transform', "translate(400 200) rotate(#{(time / 100) % 360})")

      false

  drawGherkin = (svg) ->
    nodes = []
    relationships = []

    spacing = 30
    rows = []
    d = 4
    w = 2
    for y in [-d..d]
      columns = if y % 2 is 0
        [-w..w]
      else
        (x - .5 for x in [-w + 1..w])
      rows.push columns.map (x) ->
        x: spacing * x * Math.cos(y / 4)
        y: spacing * y

    for row in rows
      for node in row
        nodes.push node

    for y in [0..rows.length - 3] by 2
      relationships.push
        source: rows[y + 2][0]
        target: rows[y][0]
      relationships.push
        source: rows[y + 2][rows[y + 2].length - 1]
        target: rows[y][rows[y].length - 1]

    for y in [1..rows.length - 1]
      highRow = rows[y - 1]
      lowRow = rows[y]
      if lowRow.length < highRow.length
        for ignored, x in lowRow
          relationships.push
            source: highRow[x]
            target: lowRow[x]
          relationships.push
            source: lowRow[x]
            target: highRow[x + 1]
      else
        for ignored, x in highRow
          relationships.push
            source: highRow[x]
            target: lowRow[x]
          relationships.push
            source: lowRow[x + 1]
            target: highRow[x]

    gherkinGroup = svg.append('g')
    .attr('transform', "translate(100 200)")

    drawGraph nodes, relationships, gherkinGroup

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

    drawWheel svg
    drawGherkin svg