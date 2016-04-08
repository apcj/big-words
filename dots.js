(function() {

    d3.selectAll('div.slide').each(function() {
        var parent = d3.select(this);

        var radius = 50;
        var padding = 10;
        var count = 20;
        var data = [];
        for (var x = -count; x < count; x++) {
            for (var y = -count; y < count; y++) {
                data.push({
                    x: x * (radius * 2 + padding),
                    y: y * (radius * 2 + padding),
                    delay: Math.random() * 1000 * 2 * Math.PI
                });
            }
        }

        function viewBox(size) {
            return [-size, -size, size * 2, size * 2].join(' ');
        }
        var svg = parent.append('svg');
        svg
            .attr('class', 'fill')
            .attr('viewBox', viewBox(radius))
            .transition()
            .duration(30000)
            .attr('viewBox', viewBox(1000));

        var circles = svg.selectAll('circle').data(data);

        circles
            .enter().append('circle')
            .attr('r', radius)
            .attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; })
            .attr('r', radius);

        var colour = d3.interpolateRgb("#FFF", "#000");
        d3.timer(function(t) {
            circles
                .attr('fill', function(d) {
                    return colour(Math.sin((t - d.delay) / 1000));
                })
        });
    });
})();
