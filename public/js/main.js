// Testing

//==================== Materialize Initializations ====================
// // For the slider animation for different queries
// $(document).ready(function(){
// 	$('ul.tabs').tabs({
// 		swipeable : true,
// 		responsiveThreshold : 1920
// 	});
// });
// For loading the modal
$(document).ready(function(){
	$('.modal').modal();
});
// For Materialize select to work properly
$(document).ready(function(){
	$('#rsid-select').formSelect();
});
$(document).ready(function(){
	$('#trait-select').formSelect();
});
$(document).ready(function(){
	$('.collapsible').collapsible();
});
$(document).ready(function(){
	$('.modal').modal();
});
$(document).ready(function(){
	$('.collapsible').collapsible();
});

//==================== Search Functions ====================

function studySearch(name) {
	var exp = /rs[0-9]+/;
	var q_url = (exp.test(name)) ? '/rsidStudyInfo/' : '/traitStudyInfo/';
	
	$.ajax({
		url: q_url+encodeURIComponent(name),
		type: 'get',
		dataType: 'json',
		success: function(response) {
			info_data = response['data']
			console.log(info_data)
			console.log(q_url+encodeURIComponent)
			var info_parent = document.getElementById('detailed-info');
			$('#table-info tbody').find('tr').remove();
			$(info_data).each(function() {
				// console.log(JSON.stringify(this))
				info = JSON.stringify(this);
				snp_url = 'https://www.ncbi.nlm.nih.gov/snp/'+this.rsid;
				$('#table-info').find('tbody')
					.append($('<tr>')
						.append($('<td>')
							.append($('<a>')
								.attr('href', snp_url)
								.attr('target', '_blank')
								.text(this.rsid)
							)
						)
						.append($('<td>')
							.append(this.allele)
						)
						.append($('<td>')
							.append(this.trait)
						)
						.append($('<td>')
							.append($('<a>')
								.attr('href', 'https://'+this.link)
								.attr('target', '_blank')
								.text(this.pubmed_id)
							)
						)
						.append($('<td>')
							.append(this.title)
						)
					);
			});
		}
	});
}

// AJAX call function to
// 1. Populate Materialize select list
// 2. Plot (first, if there are more) pie chart & box plot

function rsidSearch(obj) { // NEED TO RE-WRITE THIS FUNCTION TO INCREASE MODULARITY
	// input should be an object:
	// { cho_maj: "53", cho_min: "135", clm_maj: "105", clm_min: "83",
	//   eff_allele: "C", maj_allele: "C", min_allele: "G",
	//   rsid: "rs1000005", trait: "Eosinophil counts" }
	$.ajax({
		url: '/getTrait/'+encodeURIComponent(obj),
		type: 'get',
		dataType: 'json',
		success: function(response) {
			// Clear previous select options on user selecting a rsID
			// console.log('getRsid success')
			console.log(response)
			// $('#rsid-select').prop('disabled', true); // NOT WORKING
			// $('#trait-select').prop('disabled', false);
			$('#trait-select').find('option').remove();
			var traits = response['data'];
			// Draw a pie chart using the first trait
			displayPie(traits[0]);
			// console.log(traits[0].trait); // Returns the name of the first trait
			traitScores(traits[0].trait);
			studySearch(traits[0].rsid);
			// Populate select options for a selected rsID
			$(traits).each(function() {
				var j_data = JSON.stringify(this);
				// console.log(j_data);
				$('#trait-select').append($('<option>').attr({"data-value":j_data, "trait": this.trait, "rsid": this.rsid}).text(this.trait));
				// $('#trait-select').formSelect();
			});
			$('#trait-select').formSelect();
		}
	}); 
}

function traitSearch(obj) { // NEED TO RE-WRITE THIS FUNCTION TO INCREASE MODULARITY
	// input should be an object:
	// { cho_maj: "53", cho_min: "135", clm_maj: "105", clm_min: "83",
	//   eff_allele: "C", maj_allele: "C", min_allele: "G",
	//   rsid: "rs1000005", trait: "Eosinophil counts" }
	$.ajax({
		url: '/getRsid/'+encodeURIComponent(obj),
		type: 'get',
		dataType: 'json',
		success: function(response) {
			// Clear previous select options on user selecting a rsID
			// console.log('getRsid success')
			// $('#rsid-select').prop('disabled', false);
			// $('#trait-select').prop('disabled', true);
			$('#rsid-select').find('option').remove();
			var rsids = response['data'];
			// Draw a pie chart using the first trait
			displayPie(rsids[0]);
			// console.log(rsids[0].trait); // Returns the name of the first trait
			traitScores(rsids[0].trait);
			studySearch(rsids[0].trait);
			// Populate select options for a selected rsID
			$(rsids).each(function() {
				var j_data = JSON.stringify(this);
				// console.log(j_data);
				$('#rsid-select').append($('<option>').attr({"data-value":j_data, "trait": this.trait, "rsid": this.rsid}).text(this.rsid));
			});
			$('#rsid-select').formSelect();
		}
	}); 
}

function traitScores(name) {
	$.ajax({
		url: '/getTraitScores/'+encodeURIComponent(name),
		type: 'get',
		dataType: 'json',
		success: function(response) {
			// console.log(response['data']);
			var scores = response['data']; //NEED TO HANDLE CASES WHERE PRS SCORES ARE MISSING
			var cho_scores = scores[0]['cho'].split(";");
			var clm_scores = scores[0]['clm'].split(";");
		    svgBox.selectAll("rect").remove();
		    svgBox.selectAll("line").remove();
		    svgBox.selectAll("circle").remove();
			displayBoxPlot(cho_scores, clm_scores);
		}
	});
}

// Change boxplot by filling in below
function changeTrait(){
	var trait_select = document.getElementById("trait-select");
	var trait_selected = trait_select.options[trait_select.selectedIndex].value;
	$(document).ready(function(){
	traitSearch(trait_selected); // Returns data attribute from the selected option
}

// Change pie chart by filling in below
function changeVariant(){
	var rsid_select = document.getElementById("rsid-select");
	var rsid_selected = rsid_select.options[rsid_select.selectedIndex].value;
	rsidSearch(rsid_selected); // Returns data attribute from the selected option
}

// Autocomplete for traits
$(document).ready(function() {

	var bloodhound = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.nonword,
		queryTokenizer: Bloodhound.tokenizers.nonword,
		remote: {
			url: '/traitAutocomplete/?q=%QUERY%',
			wildcard: 'QUERY%'
		}
	});
	// console.log(bloodhound);
	$('#trait_search').typeahead({
		limit: 5,
		hint: true,
		highlight: true
	},{
		name: 'traits',
		source: bloodhound,
		display: function(data) {
			console.log(data.trait);
			return data.trait;
		}
	});

	$('.trait_typeahead').bind('typeahead:select', function(event, input) {
		// Search the selected rsID in the database to create plots
		traitSearch(input.trait);
	});
});

// Autocomplete for rsIDs
$(document).ready(function() {

	var bloodhound = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.nonword,
		queryTokenizer: Bloodhound.tokenizers.nonword,
		remote: {
			url: '/rsidAutocomplete/?q=%QUERY%',
			wildcard: 'QUERY%'
		}
	});
	$('#rsid_search').typeahead({
		limit: 5,
		hint: true,
		highlight: true
	},{
		name: 'rsids',
		source: bloodhound,
		display: function(data) {
			// console.log(data.rsid);
			return data.rsid;
		}
	});

	$('.rsid_typeahead').bind('typeahead:select', function(event, input) {
		// Search the selected rsID in the database to create plots
		rsidSearch(input.rsid);
	});
});

// Populate rsID example data
$(document).ready(function(){
	$('#rsid-example').click(function(){
		$('#trait-select').prop('disabled', false);
		$('#rsid-select').prop('disabled', true);
		$('#rsid-select').find('option').remove();
		$('#trait-select').find('option').remove();
		$('#rsid-select').append($('<option>').text('Select rsID'));
		$('#rsid-select').formSelect();
		$('#trait-select').formSelect();
		$('#rsid_search').val('rs10182181');
		rsidSearch('rs10182181');
	});
});

// Populate trait example data
$(document).ready(function(){
	$('#trait-example').click(function(){
		$('#rsid-select').prop('disabled', false);
		$('#trait-select').prop('disabled', true);
		$('#rsid-select').find('option').remove();
		$('#trait-select').find('option').remove();
		$('#trait-select').append($('<option>').text('Select trait'));
		$('#rsid-select').formSelect();
		$('#trait-select').formSelect();
		$('#trait_search').val('Obesity');
		traitSearch('Obesity');
	});
});
