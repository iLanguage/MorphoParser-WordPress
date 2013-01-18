function renderSVG(words) {
	if (words) {

		var SVGheight = 400;
		var SVGwidth = 800;
		var SVGarea = SVGheight * SVGwidth;
		var SVGxcoord = 50;
		var SVGycoord = 50;
		var fillcolor = "white";
		var maxX = SVGwidth + SVGxcoord;
		var maxY = SVGheight + SVGycoord;

		var SVG = function(h, w) {
			var NS = "http://www.w3.org/2000/svg";
			var svg = document.createElementNS(NS, "svg");
			svg.width = w;
			svg.height = h;
			svg.x = SVGxcoord;
			svg.y = SVGycoord;
			return svg;
		}

		var rect = function(h, w, fill) {
			var NS = "http://www.w3.org/2000/svg";
			var SVGObj = document.createElementNS(NS, "rect");
			SVGObj.width.baseVal.value = w;
			SVGObj.height.baseVal.value = h;
			SVGObj.setAttribute("height", h);
			SVGObj.setAttribute("x", SVGxcoord);
			SVGObj.setAttribute("y", SVGycoord);
			SVGObj.setAttribute("stroke-width", 3);
			SVGObj.setAttribute("stroke", "black");
			SVGObj.style.fill = fill;
			return SVGObj;
		}

		var svg = SVG(SVGheight, SVGwidth);
		var r = rect(SVGheight, SVGwidth, fillcolor);

		document.getElementById('svgimage').appendChild(svg);
		svg.appendChild(r);

		var maxValue = 0;
		for (key in words) {
			if (words[key] > maxValue) {
				maxValue = words[key];
			}
		}

		// Place words on SVG
		for (key in words) {

			var xcoord = (Math.floor(Math.random() * (maxX - SVGxcoord + 1)) + SVGxcoord);
			var ycoord = (Math.floor(Math.random() * (maxY - SVGycoord + 1)) + SVGycoord);
			var fontsize = (10 + (words[key] / maxValue) * (SVGarea / 2500))
					+ 'px';
			var color1 = Math.floor(Math.random() * 255);
			var color2 = Math.floor(Math.random() * 255);
			var color3 = Math.floor(Math.random() * 255);
			var randBool = Math.floor(Math.random() * 2);

			var textelement = document.createElementNS(
					'http://www.w3.org/2000/svg', 'text');
			textelement.setAttribute("id", "text1");
			textelement.setAttribute("x", xcoord);
			textelement.setAttribute("y", ycoord);
			textelement.setAttribute("font-size", fontsize);
			textelement.style.fill = "rgb(" + color1 + "," + color2 + ","
					+ color3 + ")";
			var transform;
			if (randBool) {
				transform = 90;
			} else {
				transform = 0;
			}
			textelement.setAttribute("transform", "rotate(" + transform + " "
					+ xcoord + " " + ycoord + ")");
			textelement.textContent = key;
			svg.appendChild(textelement);
		}
	} else {
		console.log("No words.");
	}
};