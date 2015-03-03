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

        function blink() {
            d3.select(this)
            .transition()
            .duration(500)
            .delay(500)
            .attr('fill', '#000')
            .each('end', function() {
                d3.select(this)
                .transition()
                .duration(500)
                .delay(500)
                .attr('fill', '#FFF')
                .each('end', blink)
            });
        }

        circles
            .enter().append('circle')
            .attr('r', radius)
            .attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; })
            .attr('fill', '#FFF')
            .attr('r', radius);

        var colour = d3.interpolateRgb("#FFF", "#000");
        d3.timer(function(t) {
            circles
                .attr('fill', function(d) {
                    return colour(Math.sin((t - d.delay) / 1000));
                })
        });
//            .transition()
//            .delay(function() { return Math.random() * 10000; })
//            .attr('fill', '#000')
//            .each('end', blink);

//        setInterval(function() {
//            for (var p = 0; p < 10; p++) {
//                var i = Math.floor(Math.random() * data.length);
//                data[i].state = !data[i].state;
//            }
//            circles
//                .transition()
//                .attr('fill', function(d) { return d.state ? '#FFF' : '#000'})
//        }, 10)
    });
})();
