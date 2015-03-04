(function() {

    d3.selectAll('div.slide').each(function() {
        var parent = d3.select(this);

        var svg = parent.append('svg')
            .attr('class', 'fill')
            .attr('viewBox', [-500, -500, 1000, 1000].join(' '));

        var nodeCount = 1500;
        var nodeRadius = 7;
        var nodeSpacing = 20;
        var connectReach = 500;
        var maxDegree = 3;
        var nodes = [];
        var relationships = [];

        for (var i = 0; i < nodeCount; i++) {
            nodes.push({
                id: i,
                x: Math.random() * 2000 - 1000,
                y: Math.random() * 2000 - 1000,
                radius: nodeRadius,
                neighbours: []
            });
        }

        function collide(node) {
            var r = node.radius + 16,
                nx1 = node.x - r,
                nx2 = node.x + r,
                ny1 = node.y - r,
                ny2 = node.y + r;
            return function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== node)) {
                    var x = node.x - quad.point.x,
                        y = node.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = node.radius + nodeSpacing + quad.point.radius;
                    if (l < r) {
                        l = (l - r) / l * .5;
                        node.x -= x *= l;
                        node.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            };
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

        function avoidOverlap() {
            var q = d3.geom.quadtree(nodes),
                i = 0,
                n = nodes.length;

            while (++i < n) q.visit(collide(nodes[i]));
        }
        avoidOverlap();
        function connectNeighbours() {
            var q = d3.geom.quadtree(nodes),
                i = 0,
                n = nodes.length;

            while (++i < n) q.visit(findNeighbours(nodes[i]));

            for (i = 0; i < n; i++)
            {
                var node = nodes[i];
                node.neighbours.sort(function(a, b) { return a.distance - b.distance });
                for (var j = 0; j < maxDegree && j < node.neighbours.length; j++)
                {
                    var neighbour = node.neighbours[j];
                    if (true || neighbour.node.id > node.id)
                    {
                        relationships.push({
                            source: node,
                            target: neighbour.node
                        });
                    }
                }
            }
        }
        connectNeighbours();

        var arrows = svg.selectAll('path.arrow').data(relationships);

        arrows.enter().append('path')
            .attr('class', 'arrow')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 1);

        var circles = svg.selectAll('circle.node').data(nodes);

        circles.enter().append('circle')
            .attr('class', 'node')
            .attr('r', function(d) { return d.radius; })
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .attr('stroke-width', 1);

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
    });
})();
