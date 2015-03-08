---
---

dummyStatementToHelpIntelliJWithPreamble = true

do ->
  d3.selectAll('div.slide').each ->
    size = 200
    nodeCount = size * size / 500
    nodeRadius = 7
    connectReach = 200
    maxDegree = 5
    nodes = []
    relationships = []
    nextRelationshipId = 0
    modifications = 10

    for i in [0..nodeCount - 1]
      nodes.push
        id: i
        x: size * (Math.random() * 2 - 1)
        y: size * (Math.random() * 2 - 1)
        radius: nodeRadius
        degree: Math.floor(Math.random() * (maxDegree - 1)) + 1
        neighbours: []

    findNeighbours = (node) ->
      r = node.radius + connectReach
      nx1 = node.x - r
      nx2 = node.x + r
      ny1 = node.y - r
      ny2 = node.y + r
      (quad, x1, y1, x2, y2) ->
        if quad.point and quad.point isnt node
          x = node.x - quad.point.x
          y = node.y - quad.point.y
          l = Math.sqrt(x * x + y * y)
          r = node.radius + connectReach + quad.point.radius
          if l < r
            node.neighbours.push
              distance: l,
              node: quad.point
        x1 > nx2 or x2 < nx1 or y1 > ny2 or y2 < ny1

    connectNeighbours = ->
      q = d3.geom.quadtree(nodes)

      for node in nodes
        q.visit(findNeighbours(node))

      for node in nodes
        node.neighbours.sort((a, b) -> a.distance - b.distance)
        connections = Math.min(node.degree, node.neighbours.length)
        for i in [0..connections - 1]
          neighbour = node.neighbours[i]
          relationships.push
            id: nextRelationshipId++,
            source: node,
            target: neighbour.node

    connectNeighbours()

    parent = d3.select(this)
    viewBox = (size) ->
      [-size / 2, -size / 2, size, size].join(' ')

    svg = parent.append('svg')
    .attr('class', 'fill')
    .attr('viewBox', viewBox(size * 2))

    arrowLayer = svg.append('g')
      .attr('class', 'layer')
    circleLayer = svg.append('g')
      .attr('class', 'layer')

    arrows = []
    circles = []
    update = ->
      arrows = arrowLayer.selectAll('path.arrow').data(relationships, (d) -> d.id)

      arrows.enter().append('path')
        .attr('class', 'arrow')
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 10)
        .transition()
        .duration(2000)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)

      arrows.exit().remove()

      circles = circleLayer.selectAll('circle.node').data(nodes)

      circles.enter().append('circle')
        .attr('class', 'node')
        .attr('r', (d) -> d.radius)
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
    tickCounter = 0
    tick = ->
      arrows
        .attr('transform', (d) -> 'translate(' + d.source.x + ' ' + d.source.y + ')')
        .attr('d', (d) ->
          dx = d.target.x - d.source.x
          dy = d.target.y - d.source.y
          return 'M 0 0 L ' + dx + ' ' + dy
        )

      circles
        .attr('cx', (d) -> d.x )
        .attr('cy', (d) -> d.y )
      tickCounter++

    setInterval ->
      d3.select('#fps').text(tickCounter)
      tickCounter = 0
    , 1000

    update()
    tick()
    force = d3.layout.force()
      .nodes(nodes)
      .links(relationships)
      .charge(-10)
      .gravity(0.01)
      .linkDistance(40)
      .on('tick', tick)
      .start()

    addRelationship = ->
      i = Math.floor(Math.random() * nodeCount)
      node = nodes[i]
      if node.degree < maxDegree - 1 and node.neighbours.length > node.degree
        relationships.push
          id: nextRelationshipId++,
          source: node,
          target: node.neighbours[node.degree].node
        node.degree++

    removeRelationship = ->
      i = Math.floor(Math.random() * nodeCount)
      node = nodes[i]
      if node.degree > 1
        relationships = relationships.filter((d) ->
          not (d.source is node and d.target is node.neighbours[node.degree - 1].node))
        node.degree--

    setInterval ->
      for ignored in [1..modifications]
        addRelationship()
        removeRelationship()
      update()
      force
        .links(relationships)
        .start()
    , 100