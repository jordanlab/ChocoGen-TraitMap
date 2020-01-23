<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<!-- jquery -->
	<script src="/js/jquery-3.4.0.min.js"></script>
	<script src="/js/popper.min.js"></script>
	<!-- typeahead -->
	<script src="/js/typeahead.bundle.min.js"></script>
	<!-- material -->
	<link rel="stylesheet" href="css/materialize.min.css">
	<script src="/js/materialize.min.js"></script>
	<!-- d3 -->
	<script src="/js/d3.min.js"></script>
	<script src="/js/taffydb/taffy-min.js"></script>
	<!-- awesomeplete -->

	<!-- .js required for the page -->
	<script src="/js/main.js"></script>
	<script src="/js/pie.js"></script>
	<script src="/js/boxplot.js"></script>

	<link rel="stylesheet" href="css/main.css">
</head>
<body>
	<div class="container">
		<div>
			<center>
				<title>ChocoGen TraitMap</title>

				<h1>Colombian Genotype-Phenotype Browser</h1>
				<h5>
					Explore the genetic architecture of phenotypic diversity between Antioquia (Mestizo) and Chocó (Afro-Colombian)
				</h5>
				<!-- Modal Trigger -->
				<a class="waves-effect waves-light btn modal-trigger" href="#modal1">About Us</a>
				<!-- Modal Structure -->
				<div id="modal1" class="modal">
					<div class="modal-content">
						<h4>About Us</h4>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
					</div>
					<div class="modal-footer">
						<a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
					</div>
  				</div>
			</center>
		</div>
			<div class="row">
				<div class="row">
					<div class="col s3"></div>
					<div class="col s3">
						<input type="text" placeholder="Enter rsID" id="rsid_search" name="rsid_search" class="rsid_typeahead" autocomplete="off" />
					</div>
					<div class="col s3">
						<input type="text" placeholder="Enter trait" id="trait_search" name="trait_search" class="trait_typeahead" autocomplete="off" />
					</div>
					<div class="col s3"></div>
				</div>
				<div class="row">
					<div class="col s3"></div>
					<div class="col s3">
						<select id="rsid-select" onchange="changeVariant()">
							<option value="" disabled selected>Select rsID</option>
						</select>
					</div>
					<div class="col s3">
						<select id="trait-select" onchange="changeTrait()">
							<option value="" disabled selected>Select trait</option>
						</select>
					</div>
					<div class="col s3"></div>
				</div>
				<div class="row">
					<div class="col s3"></div>
					<div class="col s3">
						<center><button id="rsid-example" class="btn">Variant ID Example</button></center>
					</div>
					<div class="col s3">
						<center><button id="trait-example" class="btn">Trait Name Example</button></center>
					</div>
					<div class="col s3"></div>
<!-- 					<center>
						<div>
							<button id="rsid-example" class="btn">Variant ID Example</button>
							<button id="trait-example" class="btn">Trait Name Example</button>
						</div>
					</center> -->
				</div>
				<div class="col s6">
<!-- 						<div class="input-field">
							<select id="rsid-select">
								<option value="" disabled selected>Select a trait</option>
							</select>
						</div> -->
					<div id="pie-chart"> 
						<script>
							// Script to draw the map of Colombia

							var width=900, height=900, radius=60;

							var svgMap=d3.select("#pie-chart")
								.append("div")
								.classed("svg-container-pie", true)
								.append("svg")
								.attr("preserveAspectRatio", "xMinYMin meet")
								// .attr("viewBox", "0 -100 900 700")
								.attr("viewBox", "-50 -160 900 1200")

							var projection = d3.geoMercator()
								.scale(2500)
								.center([-70,7])
								.translate([width/1.2, height/5]);

							var path = d3.geoPath().projection(projection);

							var gMap = svgMap.append("g");
							var gPie = svgMap.append("g");

							var arc = d3.arc()
								.innerRadius(0)
								.outerRadius(radius);

							var pie = d3.pie()
								.sort(null)
								.value(function(d) { return d; });

							var pie_input = document.getElementById("rsid");

							d3.json("/json/colombia_geo.json").then(function(mapData) {

								var features = mapData.features;
								gMap.selectAll("path")
									.data(features)
									.enter().append("path")
									.attr("class", "province")
									.attr("d", path)
									.attr('vector-effect', 'non-scaling-stroke')
									.style("fill", colorProv);
							});
						</script>
					</div>
				</div>
				<div class="col s6">
					<div id="info-pie">
						<div id='box-plot'>
							<script type="text/javascript">
								// set the dimensions and margins of the graph
								var width = 900, height = 800

								// append the svg object to the body of the page
								var svgBox = d3.select("#box-plot")
								  .append("div")
								  .classed("svg-container-box", true)
								  .append("svg")
								  .attr("id", "svgBox")
								  .attr("preserveAspectRatio", "xMinYMin meet")
								  .attr("viewBox", "-50 -160 900 1200")

								var x_axis = d3.scaleBand()
								  .range([0, width])
								  .domain(["CHO","CLM"])
								  .paddingInner(.5)
								  .paddingOuter(.5)

								svgBox.append("g")
								  .attr("transform", "translate(25,"+ (height+130) +")")
								  .attr("class", "x-axis")
								  // .attr("stroke", "white")
								  .call(d3.axisBottom(x_axis))

								var y_axis = d3.scaleLinear()
								  .domain([0,100])
								  .range([height+100, 0])

								svgBox.append("g")
								  .attr("transform", "translate(25,"+ 0 +")")
								  .attr("class", "y-axis")
								  .call(d3.axisLeft(y_axis))

								svgBox.selectAll(".x-axis .tick").remove();
							</script>
						</div>
					</div>
				</div> <!-- col s6 div -->
			</div>
			<div class="row">
				<div class="col s12">
					<div class="info-collapse">
						<ul class="collapsible">
							<li>
								<div class="collapsible-header"><h6>Additional Information</h6></div>
								<div class="collapsible-body">
									<div style="height: 300px; overflow: auto;">
									<table id="table-info" class="responsive-table">
										<thead>
											<tr>
												<th>rsID</th>
												<th>Effect Allele</th>
												<th>Trait</th>
												<th>PubMed</th>
												<th>Study Name</th>
											</tr>
										</thead>
										<tbody>
										</tbody>
									</table>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
</body>
</html>
