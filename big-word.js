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

    d3.selectAll('svg').each(function() {
        var svg = d3.select(this);

        var maxSvgWidth = 0;

        svg.selectAll('text').each(function() {
            var text = d3.select(this);
            maxSvgWidth = measureText(text.text(), window.getComputedStyle(this, null));
            text
                .attr('font-size', '100px')
                .attr('alignment-baseline', 'central');
        });

        svg.attr('viewBox', [0, -50, maxSvgWidth, 100].join(' '));
    });
})();
