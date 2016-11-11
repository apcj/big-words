(function() {

    d3.selectAll('div.slide').each(function() {
        var parent = d3.select(this);

        var canvas = parent.append('canvas')
            .attr('class', 'fill').node();
        canvas.width = this.clientWidth;
        canvas.height = this.clientHeight;

        var count = 8;
        var t = 0;
        var xData = { points: [], offset: 0 };
        var yData = { points: [], offset: 0 };
        for (var i = 0; i < count; i++) {
            xData.points.push({
                d: Math.random(),
                velocity: Math.random() * 2 - 1
            });
            yData.points.push({
                d: Math.random(),
                velocity: Math.random() * 2 - 1
            });
        }

        var colours = [];
        for (var x = 0; x <= count; x++) {
            for (var y = 0; y <= count; y++) {
                colours.push(d3.hsl(Math.random() * 360, 0.5 + Math.random() / 2, 0.7));
                // colours.push((x * (count + 1) + y) % 2 === 0 ? 'black' : 'white');
            }
        }

        function advance(data, elapsed) {
            for (var i = 0; i < data.points.length; i++) {
                var dot = data.points[i];
                dot.d = dot.d + (elapsed - t) * dot.velocity / 5000;
                if (dot.d < 0) {
                    dot.d = 1;
                    data.offset--;
                    if (data.offset < 0)
                    {
                        data.offset = count;
                    }
                }
                if (dot.d > 1) {
                    dot.d = 0;
                    data.offset++;
                    if (data.offset > count)
                    {
                        data.offset = 0;
                    }
                }
            }
            data.points.sort(function(a, b) {
                return b.d - a.d;
            });
        }

        d3.timer(function(elapsed) {

            advance(xData, elapsed);
            advance(yData, elapsed);
            t = elapsed;

            var ctx = canvas.getContext('2d');
            for (var x = 0; x <= xData.points.length; x++) {
                var xPoint = x === 0 ? {d: 1} : xData.points[x - 1];
                for (var y = 0; y <= yData.points.length; y++) {
                    var yPoint = y === 0 ? {d: 1} : yData.points[y - 1];
                    ctx.fillStyle = colours[(x + xData.offset) % (count + 1) * (count + 1) + (y + yData.offset) % (count + 1)];
                    ctx.fillRect(0, 0, xPoint.d * canvas.width, yPoint.d * canvas.height);
                }
            }
        });
    });
})();
