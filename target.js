(function() {

    d3.selectAll('div.slide').each(function() {
        var parent = d3.select(this);

        var canvas = parent.append('canvas')
            .attr('class', 'fill').node();
        canvas.width = this.clientWidth;
        canvas.height = this.clientHeight;

        var count = 15;
        var data = [];
        for (var i = 0; i < count; i++) {
            data.push({
                t: 0,
                radius: Math.random(),
                velocity: Math.random() * 2 - 1
            });
        }

        d3.timer(function(elapsed) {
            var scale = Math.max(canvas.width, canvas.height);

            for (var i = 0; i < data.length; i++) {
                var dot = data[i];
                dot.radius = dot.radius + (elapsed - dot.t) * dot.velocity / 2000;
                dot.t = elapsed;
                if (dot.radius < 0) {
                    dot.radius = 0;
                    dot.velocity = -dot.velocity;
                }
                if (dot.radius > 1) {
                    dot.radius = 1;
                    dot.velocity = -dot.velocity;
                }
            }
            data.sort(function(a, b) { return b.radius - a.radius; });

            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            for (var j = 0; j < data.length; j++) {
                var dot = data[j];
                ctx.fillStyle = j % 2 === 1 ? 'white' : 'black';
                ctx.beginPath();
                ctx.arc(0, 0, dot.radius * scale, 0, Math.PI * 2, false);
                ctx.fill();
            }
            ctx.restore();
            // return true;
        });
    });
})();
