var worldmap = d3.geomap.choropleth()
      .geofile('../dist/topojson/world/countries.json')
      .colors(colorbrewer.YlOrRd[9])
      .column('Calculated Percentage')
      .duration(500)
      .format(d3.format(',.02f'))
      .legend(true)
      .postUpdate(annotation);

  d3.csv('globalslaveryindex.csv', function(error, data) {
      d3.select("#map")
          .datum(data)
          .call(worldmap.draw, worldmap);
  });

  d3.select('#map-select').on('change', function() {
      worldmap.column(this.value).update();
  });

  d3.select('#dataset-change-button').on('click', function() {
      generateNewData();
  });

  /* Initialize tooltip */
  tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });

  function generateNewData() {
      worldmap.data = worldmap.data.map(function(row) {
          row['Calculated Percentage'] = getRandomArbitrary(0,10) + '';
          return row;
      })
      worldmap.column('Calculated Percentage').update();
  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  function annotation() {
      var anno_height = 60;

      // Remove possibly existing annotation, when map is updated.
      worldmap.svg.selectAll('g.annotation').remove();

      fg = worldmap.svg.append('g')
          .attr('class', 'annotation')
          .attr('width', '100%')
          .attr('height', anno_height)
          .attr('transform', 'translate(0,' + (worldmap.height() - anno_height) + ')')

      fg.append('rect')
          .attr('x', '10%')
          .attr('width', '76%')
          .attr('height', anno_height)
          .style('fill-opacity', .8)
          .style('fill', '#fff');

      fg.append('text')
          .attr('x', '12%')
          .attr('y', 22)
          .style('color', '#444')
          .style('font-size', '18px')
          .text('World Wide Prevalence of Slavery in 2013')

      fg.append('text')
          .attr('width', '76%')
          .attr('x', '12%')
          .attr('y', 45)
          .style('color', '#444')
          .style('font-size', '12px')
          .text('Data source: globalslaveryindex.org | Author: Ramiro Gómez - ramiro.org')

      worldmap.svg.selectAll('path.unit')
      .on('click', function() {
        var country = d3.select(this);
        console.log(this.innerHTML.replace('title', 'p').replace('/title', '/p'));
        showModal(this.innerHTML.replace('title', 'p').replace('/title', '/p'));
      })
  }