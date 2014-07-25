(function() {

    function measureText(text, styleSource) {
        var fontFamily = styleSource.getPropertyValue('font-family');
        var fontWeight = styleSource.getPropertyValue('font-weight');
        var canvasSelection = d3.select('#textMeasuringCanvas').data([this]);
        canvasSelection.enter().append('canvas')
            .attr('id', 'textMeasuringCanvas');

        var canvas = canvasSelection.node();
        var context = canvas.getContext('2d');
        context.font = 'normal normal ' + fontWeight + ' 100px/normal ' + fontFamily;
        return context.measureText(text).width;
    }

    d3.selectAll('div.big-words').each(function() {
        var parent = d3.select(this.parentElement);
        var svg = parent.append('svg');

        var maxSvgWidth = 0;

        d3.select(this).selectAll('p.full-width').each(function() {
            var text = d3.select(this);
            maxSvgWidth = measureText(text.text(), window.getComputedStyle(this, null));
            svg.append('text')
                .attr('font-size', '100px')
                .attr('alignment-baseline', 'central')
                .text(text.text());
        });

        svg.attr('viewBox', [0, -50, maxSvgWidth, 100].join(' '));
    });
})();
