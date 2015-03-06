(function() {

    d3.selectAll('div.slide').each(function() {
        var size = 1000;
        var nodeCount = size * size / 500;
        var nodeRadius = 7;
        var connectReach = 200;
        var maxDegree = 5;
        var nodes = [];
        var relationships = [];
        var nextRelationshipId = 0;
        var modifications = 10;

        for (var i = 0; i < nodeCount; i++) {
            nodes.push({
                id: i,
                x: size * (Math.random() * 2 - 1),
                y: size * (Math.random() * 2 - 1),
                radius: nodeRadius,
                degree: Math.floor(Math.random() * (maxDegree - 1)) + 1,
                neighbours: []
            });
        }

        function findNeighbours(node) {
            var r = node.radius + connectReach,
                nx1 = node.x - r,
                nx2 = node.x + r,
                ny1 = node.y - r,
                ny2 = node.y + r;
            return function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== node)) {
                    var x = node.x - quad.point.x,
                        y = node.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = node.radius + connectReach + quad.point.radius;
                    if (l < r) {
                        node.neighbours.push({
                            distance: l,
                            node: quad.point
                        });
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            };
        }

        function connectNeighbours() {
            var q = d3.geom.quadtree(nodes),
                i = 0,
                n = nodes.length;

            while (++i < n) q.visit(findNeighbours(nodes[i]));

            for (i = 0; i < n; i++)
            {
                var node = nodes[i];
                node.neighbours.sort(function(a, b) { return a.distance - b.distance; });
                for (var j = 0; j < node.degree && j < node.neighbours.length; j++)
                {
                    var neighbour = node.neighbours[j];
                    relationships.push({
                        id: nextRelationshipId++,
                        source: node,
                        target: neighbour.node
                    });
                }
            }
        }
        connectNeighbours();

        var parent = d3.select(this);
        function viewBox(size) {
            return [-size / 2, -size / 2, size, size].join(' ');
        }

        var svg = parent.append('svg')
            .attr('class', 'fill')
            .attr('viewBox', viewBox(size));

        var arrowLayer = svg.append('g')
            .attr('class', 'layer');
        var circleLayer = svg.append('g')
            .attr('class', 'layer');

        var arrows, circles;
        function update() {
            arrows = arrowLayer.selectAll('path.arrow').data(relationships, function(d) { return d.id; });

            arrows.enter().append('path')
                .attr('class', 'arrow')
                .attr('fill', 'none')
                .attr('stroke', 'red')
                .attr('stroke-width', 10)
                .transition()
                .duration(2000)
                .attr('stroke', 'black')
                .attr('stroke-width', 1);

            arrows.exit().remove();

            circles = circleLayer.selectAll('circle.node').data(nodes);

            circles.enter().append('circle')
                .attr('class', 'node')
                .attr('r', function(d) { return d.radius; })
                .attr('fill', 'white')
                .attr('stroke', 'black')
                .attr('stroke-width', 1);
        }
        var tickCounter = 0;
        function tick(){
            arrows
                .attr('transform', function(d) { return 'translate(' + d.source.x + ' ' + d.source.y + ')' })
                .attr('d', function(d) {
                    var dx = d.target.x - d.source.x;
                    var dy = d.target.y - d.source.y;
                    return 'M 0 0 L ' + dx + ' ' + dy;
                });

            circles
                .attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; });
            tickCounter++;
        }

        setTimeout(function() {
            d3.select('#fps').text(tickCounter);
            tickCounter = 0;
        }, 1000);

        update();
        tick();
        var force = d3.layout.force()
            .nodes(nodes)
            .links(relationships)
            .charge(-10)
            .gravity(0.01)
            .linkDistance(40)
            .on('tick', tick)
            .start();

        function addRelationship() {
            var i = Math.floor(Math.random() * nodeCount);
            var node = nodes[i];
            if (node.degree < maxDegree - 1 && node.neighbours.length > node.degree) {
                relationships.push({
                    id: nextRelationshipId++,
                    source: node,
                    target: node.neighbours[node.degree].node
                });
                node.degree++;
            }
        }

        function removeRelationship() {
            var i = Math.floor(Math.random() * nodeCount);
            var node = nodes[i];
            if (node.degree > 1) {
                relationships = relationships.filter(function(d) {
                    return !(d.source === node && d.target === node.neighbours[node.degree - 1].node);
                });
                node.degree--;
            }
        }

        setInterval(function() {
            for (var i = 0; i < modifications; i++) {
                addRelationship();
                removeRelationship();
            }
            update();
            force
                .links(relationships)
                .start();
        }, 100);
    });
})();
