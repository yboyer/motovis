//@flow
var m = [20, 120, 20, 50];
var w = 900 - m[1] - m[3];
var h = 800 - m[0] - m[2];
var i = 0;
var root;

const elements = {
  a: document.querySelector('a'),
  desc: document.querySelector('#desc'),
  img: document.querySelector('img'),
  brand: document.querySelector('#brand'),
  model: document.querySelector('#model'),
  date: document.querySelector('#date'),
  price: document.querySelector('#price'),
  type: document.querySelector('#type'),
  cc: document.querySelector('#cc'),
  power: document.querySelector('#power'),
  gears: document.querySelector('#gears'),
  transmission: document.querySelector('#transmission'),
  fw: document.querySelector('#fw'),
  fh: document.querySelector('#fh'),
  fd: document.querySelector('#fd'),
  bw: document.querySelector('#bw'),
  bh: document.querySelector('#bh'),
  bd: document.querySelector('#bd'),
  capacity: document.querySelector('#capacity'),
  wheels: document.querySelector('#wheels'),
  accessories: document.querySelector('#accessories')
};

var tree = d3.layout.tree().size([h, w]);

var diagonal = d3.svg.diagonal()
  .projection(function(d) {
    return [d.y, d.x];
  });

var vis = d3.select('svg')
  .attr('width', w + m[1] + m[3])
  .attr('height', h + m[0] + m[2])
  .append('svg:g')
  .attr('transform', 'translate(' + m[3] + ',' + m[0] + ')');

function unselectAll(d) {
  d.selected = false;
  if (d.children) {
    d.children.forEach(unselectAll);
  }
}

d3.json('data.json', function(json) {
  root = json;
  root.x0 = h / 2;
  root.y0 = 0;

  function toggleAll(d) {
    if (d.children) {
      d.children.forEach(toggleAll);
      toggle(d);
    }
  }

  // Initialize the display to show a few nodes.
  root.children.forEach(toggleAll);
  toggle(root.children[0]);
  toggle(root.children[0].children[25]);
  toggle(root.children[0].children[25].children[10]);
  toggle(root.children[0].children[25].children[10].children[7]);

  update(root);
});

d3.json('accessories.json', function(json) {

  var html = '';
  json.forEach(function(accessory) {
    html += '<a href="' + accessory.url + '" target="_blank">';
    html += '  <div class="accessory">';
    html += '    <img src="' + accessory.imgUrl + '" alt="">';
    html += '    <div class="name">' + accessory.name + '</div>';
    html += '    <div class="data">';
    html += '      <span>' + accessory.price + ' €</span>';
    html += '      <span>' + accessory.stars + '/5</span>';
    html += '    </div>';
    html += '  </div>';
    html += '</a>';
  });

  elements.accessories.innerHTML = html;
});

function update(source) {
  var duration = d3.event && d3.event.altKey ? 5000 : 500;

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse();

  // Normalize for fixed-depth.
  nodes.forEach(function(d) {
    d.y = d.depth * 140;
  });

  // Update the nodes…
  var node = vis.selectAll('g.node')
    .data(nodes, function(d) {
      return d.id || (d.id = ++i);
    });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append('svg:g')
    .attr('class', 'node')
    .attr('transform', function(d) {
      return 'translate(' + source.y0 + ',' + source.x0 + ')';
    })
    .on('click', function(d) {
      toggle(d);
      update(d);
    });

  nodeEnter.append('svg:circle');

  nodeEnter.append('svg:text')
    .attr('x', function(d) {
      return d.children || d._children ? -10 : 10;
    })
    .attr('dy', '.35em')
    .attr('text-anchor', function(d) {
      return d.children || d._children ? 'end' : 'start';
    })
    .text(function(d) {
      return d.name;
    })
    .style('fill-opacity', 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(duration)
    .attr('transform', function(d) {
      return 'translate(' + d.y + ',' + d.x + ')';
    });
  nodeUpdate.select('circle')
    .attr('r', 4.5)
    .style('fill', function(d) {
      if (d._children) {
        return 'lightsteelblue';
      } else if (d.selected) {
        return '#00ff1c';
      } else if (d.data) {
        return 'steelblue';
      }
      return '#FFF';
    });
  nodeUpdate.select('text')
    .style('fill-opacity', 1)
    .style('fill', function(d) {
      if (d.selected) {
        return '#00630b';
      }
    })
    .style('font-weight', function(d) {
      if (d.selected) {
        return '700';
      }
    });

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr('transform', function(d) {
      return 'translate(' + source.y + ',' + source.x + ')';
    })
    .remove();
  nodeExit.select('circle')
    .attr('r', 1e-6);
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // Update the links…
  var link = vis.selectAll('path.link')
    .data(tree.links(nodes), function(d) {
      return d.target.id;
    });

  // Enter any new links at the parent's previous position.
  link.enter().insert('svg:path', 'g')
    .attr('class', 'link')
    .attr('d', function(d) {
      var o = {
        x: source.x0,
        y: source.y0
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .transition()
    .duration(duration)
    .attr('d', diagonal);

  // Transition links to their new position.
  link.transition()
    .duration(duration)
    .attr('d', diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr('d', function(d) {
      var o = {
        x: source.x,
        y: source.y
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}


function wheelsToHtml(array) {
  if (!array) {
    return '';
  }

  var html = '';
  array.forEach(function(wheel) {
    html += '<a href="' + wheel.url + '" target="_blank">';
    html += '  <div class="wheel">';
    html += '    <img class="pres" src="' + wheel.imgUrl + '" alt="">';
    html += '    <img src="' + wheel.logoUrl + '" alt="">';
    html += '    <div>' + wheel.name + '</div>';
    html += '    <div>' + wheel.width + '/' + wheel.height + ' x ' + wheel.diameter + '</div>';
    html += '  </div>';
    html += '</a>';
  });
  return html;
}

// Toggle children.
function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }

  if (d.data) {
    let cancel = false;
    if (d.selected) {
      elements.desc.classList.remove('show');
      elements.wheels.classList.remove('show');
      return root.children.forEach(unselectAll);
    }
    root.children.forEach(unselectAll);

    elements.desc.classList.add('show');
    elements.wheels.classList.add('show');
    elements.a.href = d.data.link;
    elements.img.src = d.data.imgUrl;
    elements.img.alt = d.data.name;
    elements.brand.textContent = d.data.brand;
    elements.model.textContent = d.data.name;
    elements.date.textContent = d.data.date;
    elements.price.textContent = (+d.data.price).toLocaleString();
    elements.type.textContent = d.data.model;
    elements.cc.textContent = d.data.info.cc;
    elements.power.textContent = d.data.info.power;
    elements.gears.textContent = d.data.info.gears;
    elements.transmission.textContent = d.data.info.transmission;

    if (d.data.info.frontWheel) {
      elements.fw.textContent = d.data.info.frontWheel.width;
      elements.fh.textContent = d.data.info.frontWheel.height;
      elements.fd.textContent = d.data.info.frontWheel.diameter;
      elements.bw.textContent = d.data.info.backWheel.width;
      elements.bh.textContent = d.data.info.backWheel.height;
      elements.bd.textContent = d.data.info.backWheel.diameter;
      var wheelsHtml = wheelsToHtml(d.data.info.frontWheel.data) + wheelsToHtml(d.data.info.backWheel.data);
      elements.wheels.innerHTML = wheelsHtml;
    } else {
      elements.fw.textContent = '??';
      elements.fh.textContent = '??';
      elements.fd.textContent = '??';
      elements.bw.textContent = '??';
      elements.bh.textContent = '??';
      elements.bd.textContent = '??';
      elements.wheels.innerHTML = '';
    }
    elements.capacity.textContent = d.data.info.capacity;
    d.selected = true;
  }
}
