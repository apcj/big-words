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

    function copyStyle(htmlStyle) {
        return function(selection) {
            selection
                .attr('font-family', htmlStyle.getPropertyValue('font-family'))
                .attr('font-weight', htmlStyle.getPropertyValue('font-weight'));
        }
    }

    d3.selectAll('div.slide-words').each(function() {
        var parent = d3.select(this.parentElement);
        var svg = parent.append('svg');

        var maxSvgWidth = 1000;
        var totalHeight = 0;
        var padding = 100;

        d3.select(this).selectAll('p.full-width').each(function(d, i) {
            var text = d3.select(this);
            var htmlStyle = window.getComputedStyle(this, null);
            var widthAt100Px = measureText(text.text(), htmlStyle);
            var fontSize = 100 * (maxSvgWidth - padding) / widthAt100Px;
            totalHeight += fontSize;
            var direction = 2 * i - 1;
            svg.append('text')
                .attr('font-size', fontSize + 'px')
                .call(copyStyle(htmlStyle))
                .text(text.text())
                .attr('y', totalHeight)
                .attr('x', direction * maxSvgWidth)
                .transition().duration(200).ease('linear')
                .attr('x', i * padding)
                .transition().duration(1000)
                .attr('x', padding - i * padding)
                .transition().duration(200)
                .attr('x', -direction * maxSvgWidth);
        });

        svg.attr('viewBox', [0, 0, maxSvgWidth, totalHeight].join(' '));
    });
})();
