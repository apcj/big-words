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

        var canvas = parent.append('canvas')
            .attr('class', 'fill').node();
        canvas.width = this.clientWidth;
        canvas.height = this.clientHeight;

        var period = 10000;
        var cut1 = period * 0.1;
        var cut2 = period * 0.8;
        var whiteToBlack = d3.interpolateRgb("#FFF", "#000");
        var phases = [
            {
                colour: function(t) {
                    return function(dot) {
                        var stage = Math.sin((t - dot.delay) / 1000);
                        var fade = d3.scale.linear().domain([cut2, period]).range([stage, 1]);
                        return whiteToBlack(fade(t));
                    }
                }
            },
            {
                colour: function(t) {
                    return function(dot) {
                        return whiteToBlack(Math.sin((t - dot.delay) / 1000));
                    }
                }
            },
            {
                colour: function(t) {
                    return function(dot) {
                        var stage = Math.sin((t - dot.delay) / 1000);
                        var fade = d3.scale.linear().domain([cut2, period]).range([stage, dot.mask ? 0 : 1]);
                        return whiteToBlack(fade(t));
                    }
                }
            }
        ];
        var visibleRadius = canvas.height / 2;
        var base = Math.sqrt(1 / count);
        d3.timer(function(elapsed) {
            var t = elapsed % period;
            var phase = t < cut1 ? phases[0] : t < cut2 ? phases[1] : phases[2];

            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            var scale = visibleRadius * Math.pow(base, 2 * t / period) / radius;
            ctx.scale(scale, scale);
            for (var i = 0; i < data.length; i++) {
                var dot = data[i];
                ctx.fillStyle = phase.colour(t)(dot);
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2, false);
                ctx.fill();
            }
            ctx.restore();
        });
    });
})();
