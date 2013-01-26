function MorphoParserController($scope) {
	$scope.renderSVG = function(data) {
		render(data);
	}
	function render(words) {
		if (words) {
			var SVGheight = 300;
			var SVGwidth = 600;
			var SVGarea = SVGheight * SVGwidth;
			var SVGxcoord = 50;
			var SVGycoord = 50;
			var fillcolor = "white";
			var fontfamily = "Arial";
			var maxX = SVGwidth + SVGxcoord;
			var maxY = SVGheight + SVGycoord;
			var attemptCount = 20;
			var deletedText = 0;

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
				SVGObj.setAttribute("width", w);
				SVGObj.setAttribute("x", SVGxcoord);
				SVGObj.setAttribute("y", SVGycoord);
				SVGObj.setAttribute("stroke-width", 1);
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

			// Place words on SVG starting from highest frequency and working to
			// lowest frequency

			var filledPixels = [];

			// Create array of words ordered by frequency
			var displayWords = [];
			for ( var i = maxValue; i > 0; i--) {
				(function(index) {
					for (key in words) {
						if (words[key] == index) {
							var newItem = {
								"word" : key,
								"frequency" : index
							};
							displayWords.push(newItem);
						}
					}
				})(i);
			}

			var numberOfWordsToDisplay = prompt(
					"Please enter the number of words to display. \n(max "
							+ displayWords.length
							+ ")\nPlease note that this may take several minutes.",
					25);
			var intRegex = /^\d+$/;
			if (!intRegex.test(numberOfWordsToDisplay)) {
				window.alert("Please try again.");
				return;
			}

			if (numberOfWordsToDisplay > displayWords.length) {
				console.log("Changing number of words to display.");
				numberOfWordsToDisplay = displayWords.length;
			}

			// Position words based on numberOfWordsToDisplay
			for ( var i = 0; i < numberOfWordsToDisplay; i++) {
				(function(index) {

					// Set random colors and create text element
					var color1 = Math.floor(Math.random() * 255);
					var color2 = Math.floor(Math.random() * 255);
					var color3 = Math.floor(Math.random() * 255);
					var randBool = Math.floor(Math.random() * 2);

					var textelement = document.createElementNS(
							'http://www.w3.org/2000/svg', 'text');
					textelement.setAttribute("id", displayWords[i].word);
					textelement.setAttribute("style", "font-family:"
							+ fontfamily + ";fill:rgb(" + color1 + "," + color2
							+ "," + color3 + ")");
					textelement.textContent = displayWords[i].word;

					// BEGIN POSITIONING OF ITEM
					// Attempt to place text randomly X times
					for ( var j = 0; j < attemptCount; j++) {
						var transform;
						if (randBool) {
							transform = 0;
						} else {
							transform = 90;
						}

						var xcoord = (Math.floor(Math.random()
								* (maxX - SVGxcoord + 1)) + SVGxcoord);
						var ycoord = (Math.floor(Math.random()
								* (maxY - SVGycoord + 1)) + SVGycoord);

						var fontsize = (10 + (displayWords[i].frequency / maxValue)
								* (SVGarea / 2500));
						textelement.setAttribute("x", xcoord);
						textelement.setAttribute("y", ycoord);
						textelement.setAttribute("font-size", fontsize + 'px');

						textelement
								.setAttribute("transform", "rotate("
										+ transform + " " + xcoord + " "
										+ ycoord + ")");
						svg.appendChild(textelement);

						// Test to see if the textbox is out of bounds
						if (transform == 0) {
							var textboxwidth = document.getElementById(
									displayWords[i].word).getBBox().width;
							var textboxheight = document.getElementById(
									displayWords[i].word).getBBox().height;
						} else {
							var textboxwidth = document.getElementById(
									displayWords[i].word).getBBox().height;
							var textboxheight = document.getElementById(
									displayWords[i].word).getBBox().width;

						}

						var otherxcoord;
						var otherycoord;

						if (transform == 0) {
							otherxcoord = xcoord + textboxwidth;
							otherycoord = ycoord - textboxheight;
						} else {
							otherxcoord = xcoord + textboxwidth;
							otherycoord = ycoord + textboxheight;
						}

						// Reposition out of bounds elements;
						if (transform == 0) {
							if (otherxcoord > maxX) {
								var xoffset = otherxcoord - maxX;
								var newxcoord = xcoord - xoffset;
								if (newxcoord > SVGxcoord) {
									xcoord = newxcoord;
								} else {
									xcoord = SVGxcoord;
								}

								textelement.setAttribute("x", xcoord);

							}

							if (otherycoord > maxY) {
								var yoffset = otherycoord - maxY;
								var newycoord = ycoord - maxY;
								if (newycoord > SVGycoord) {
									ycoord = newycoord;
								} else {
									ycoord = SVGycoord;
								}
							} else if (otherycoord < SVGycoord) {
								ycoord = SVGycoord + textboxheight;
							}
							textelement.setAttribute("y", ycoord);

						} else {
							// transform == 90 code
							if (otherycoord > maxY) {
								var yoffset = otherycoord - maxY;
								var newycoord = ycoord - yoffset;
								if (newycoord > SVGycoord) {
									ycoord = newycoord;
								} else {
									ycoord = SVGycoord;
								}
								textelement.setAttribute("y", ycoord);
							}
							if (otherxcoord > maxX) {
								var xoffset = otherxcoord - maxX;
								var newxcoord = xcoord - xoffset;
								if (newxcoord > SVGxcoord) {
									xcoord = newxcoord;
								} else {
									xcoord = SVGxcoord;
								}
								textelement.setAttribute("x", xcoord);
							}
						}
						// Get new other x and y coords

						if (transform == 0) {
							otherxcoord = xcoord + textboxwidth;
							otherycoord = ycoord - textboxheight;
						} else {
							otherxcoord = xcoord + textboxwidth;
							otherycoord = ycoord + textboxheight;
						}

						// If x or y are absolute minimal and text box is still
						// out of bounds, reduce font size until text fits

						if (ycoord == SVGycoord && otherycoord > maxY) {
							for (k = fontsize; k > 10; k--) {
								(function(kindex) {
									textelement.setAttribute("font-size",
											kindex + 'px');
									var textboxheight = document
											.getElementById(
													displayWords[i].word)
											.getBBox().width;
									if (textboxheight < SVGheight) {
										k = 10;
										textboxwidth = document.getElementById(
												displayWords[i].word).getBBox().height;
										otherxcoord = xcoord + textboxwidth;
										otherycoord = ycoord + textboxheight;
									}
								})(k);

							}
						}

						textelement
								.setAttribute("transform", "rotate("
										+ transform + " " + xcoord + " "
										+ ycoord + ")");

						// Check to see if current position overlaps any
						// other item; if so, loop (max 10); if not, set current
						// coordinates as filled
						var itemFilledPixels = [];
						var filledCoordinate = {};
						var overlap = 0;

						if (transform == 0) {
							var topy = otherycoord;
							var bottomy = ycoord;
						} else {
							var topy = ycoord;
							var bottomy = otherycoord;
						}
						for ( var yindex = topy; yindex <= bottomy; yindex++) {
							(function(yclosure) {
								for ( var xindex = xcoord; xindex <= otherxcoord; xindex++) {
									filledCoordinate = {
										"x" : xindex,
										"y" : yclosure
									};
									itemFilledPixels.push(filledCoordinate);
								}
							})(yindex);
						}
						// If coordinates are occupied, delete and try
						// again, else record newly filled pixels and
						// return

						for ( var n = 0; n < itemFilledPixels.length; n++) {
							for ( var m = 0; m < filledPixels.length; m++) {
								if (filledPixels[m].x == itemFilledPixels[n].x
										&& filledPixels[m].y == itemFilledPixels[n].y) {
									overlap = 1;
									n = itemFilledPixels.length;
									m = filledPixels.length;
								}
							}
						}
						if (overlap == 0) {
							console.log(displayWords[i].word + "("
									+ displayWords[i].frequency
									+ ") placed successfully. (" + (i + 1)
									+ " of " + numberOfWordsToDisplay + ")");
							filledPixels = filledPixels
									.concat(itemFilledPixels);
							j = attemptCount;
						} else if (overlap == 1 && j >= attemptCount - 1) {
							console.log(displayWords[i].word + "("
									+ displayWords[i].frequency
									+ ") cannot be placed. " + attemptCount
									+ " attempts.  DELETING. (" + (i + 1)
									+ " of " + numberOfWordsToDisplay + ")");
							deletedText++;
							svg.removeChild(textelement);
						}

					}

					// END POSITIONING OF ITEM

				})(i);
			}
			console.log("Deleted items: " + deletedText + " out of " + numberOfWordsToDisplay);
		} else {
			console.log("No words.");
		}
	}
	;
}