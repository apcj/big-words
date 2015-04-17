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

    circles = container.selectAll('circle').data(nodes)

    circles.enter().append('circle')
    .attr('r', (d) -> d.radius ? 7)
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
    wheelRadius = 150
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
      .attr('transform', "translate(320 340) rotate(#{(time / 100) % 360})")

      false

  drawGherkin = (svg) ->
    nodes = []
    relationships = []

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
            source: lowRow[x]
            target: highRow[x]
          relationships.push
            source: highRow[x]
            target: lowRow[x + 1]

    joinUp = (row) ->
      for x in [0..row.length - 2]
        relationships.push
          source: row[x]
          target:row[x + 1]

    joinUp rows[0]
    joinUp rows[rows.length - 1]

    relationships.push
      source: rows[0][0]
      target: rows[0][rows[0].length - 1]
      arcRatio: 1.03

    gherkinGroup = svg.append('g')
    .attr('transform', "translate(600 320)")

    drawGraph nodes, relationships, gherkinGroup

  drawBigBen = (svg) ->
    nodes = []
    relationships = []

    reflectedNodes = (x, y) ->
      nodes.push left =
        x: -x
        y: y
      nodes.push right =
        x: x
        y: y
      relationships.push
        source: left
        target: right
      [left, right]

    faceTop = null
    faceBottom = null
    faceBox = 30

    levels = [
      reflectedNodes faceBox * 3 / 5, -faceBox * 12 / 5
      reflectedNodes faceBox * 3 / 5, -faceBox * 2
      faceTop = reflectedNodes faceBox, -faceBox
      faceBottom = reflectedNodes faceBox, faceBox
      reflectedNodes faceBox, faceBox * 7
    ]
    nodes.push tip =
      x: 0
      y: -faceBox * 4
    relationships.push
      source: tip
      target: levels[0][0]
    relationships.push
      source: tip
      target: levels[0][1]
    nodes.push face =
      x: 0
      y: 0
      radius: faceBox * 4 / 5
    for corner in faceTop.concat faceBottom
      relationships.push
        source: face
        target: corner

    for y in [0..levels.length - 2]
      relationships.push
        source: levels[y][0]
        target: levels[y + 1][0]
      relationships.push
        source: levels[y][1]
        target: levels[y + 1][1]


    bigBenGroup = svg.append('g')
    .attr('transform', "translate(100 280)")

    drawGraph nodes, relationships, bigBenGroup

  drawShard = (svg) ->
    nodes = []
    relationships = []
    size = 5

    columns = []

    for x in [-size..size]
      previous = null
      columns.push column = []
      for y in [Math.abs(x)..size]
        node =
          x: x * 15
          y: y * 90
        nodes.push node
        column.push node
        if previous
          relationships.push
            source: previous
            target: node
        previous = node

    console.log columns[x]
    for x in [0..columns.length - 2]
      relationships.push
        target: columns[x + 1][0]
        source: columns[x][0]

    shardGroup = svg.append('g')
    .attr('transform', "translate(900 50)")

    drawGraph nodes, relationships, shardGroup

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
    drawBigBen svg
    drawShard svg