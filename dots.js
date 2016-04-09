(function() {

    d3.selectAll('div.slide').each(function() {
        var parent = d3.select(this);

        var radius = 50;
        var bigRadius = 10;
        var padding = 10;
        var count = 20;
        var data = [];
        for (var x = -count; x < count; x++) {
            var xr = x - (bigRadius * 2) * Math.round(x / (bigRadius * 2));
            console.log(x, xr);
            for (var y = -count; y < count; y++) {
                var yr = y - (bigRadius * 2) * Math.round(y / (bigRadius * 2));
                data.push({
                    x: x * (radius * 2 + padding),
                    y: y * (radius * 2 + padding),
                    delay: Math.random() * 1000 * 2 * Math.PI,
                    mask: Math.sqrt(xr * xr + yr * yr) < 10
                });
            }
        }

        function viewBox(size) {
            return [-size, -size, size * 2, size * 2].join(' ');
        }

        var svg = parent.append('svg')
            .attr('class', 'fill');

        var circles = svg.selectAll('circle').data(data);

        circles
            .enter().append('circle')
            .attr('r', radius)
            .attr('cx', function(d) {
                return d.x;
            })
            .attr('cy', function(d) {
                return d.y;
            })
            .attr('r', radius);

        var period = 2000;
        var cutOver = period * 0.7;
        var whiteToBlack = d3.interpolateRgb("#FFF", "#000");
        var phases = [
            {
                colour: function(t) {
                    return function(dot) {
                        return whiteToBlack(Math.sin((t - dot.delay) / 1000))
                    }
                }
            },
            {
                colour: function(t) {
                    return function(dot) {
                        var stage = Math.sin((t - dot.delay) / 1000);
                        var fade = d3.scale.linear().domain([cutOver, period]).range([stage, dot.mask ? 0 : 1]);
                        return whiteToBlack(fade(t));
                    }
                }
            }
        ];
        var scale = function(t) {
            return radius * Math.pow(count, t / period)
        };
        d3.timer(function(elapsed) {
            var t = elapsed % period;
            var phase = t < cutOver ? phases[0] : phases[1];

            svg.attr('viewBox', viewBox(scale(t)));

            circles.attr('fill', phase.colour(t))
        });
    });
})();
