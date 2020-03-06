var prev_trait = "";
var prev_rsid = "";

//==================== Materialize Initializations ====================
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
			var info_parent = document.getElementById('detailed-info');
			$('#table-info tbody').find('tr').remove();
			$(info_data).each(function() {
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
			// $('#rsid-select').prop('disabled', true);
			// $('#trait-select').prop('disabled', false);
			$('#trait-select').find('option').remove();
			var traits = response['data'];
			// Draw a pie chart using the first trait
			displayPie(traits[0]);
			prev_rsid = traits[0].rsid;
			let trait_list = []
			let curr_trait = traits[0].trait;
			let curr_rsid = traits[0].rsid;
			studySearch(traits[0].rsid);
			
			// Populate select options for a selected rsID
			$(traits).each(function() {
				var j_data = JSON.stringify(this);
				$('#trait-select').append($('<option>').attr({"data-value":j_data, "trait": this.trait, "rsid": this.rsid}).text(this.trait));
				trait_list.push(this.trait);
			});

			// Change boxplots if a search being done is the first search OR a trait exists for the rsID being searched
			if (!trait_list.includes(prev_trait) || prev_trait === '') {
				traitScores(curr_trait);
				prev_trait = curr_trait;
				$('#trait_search').val(curr_trait);
			}

			$('#rsid_search').val(traits[0]['rsid']);
			// $('#trait-select').prop('disabled', false);
			// $('#rsid-select').prop('disabled', true);
			$('#rsid-select').formSelect();
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
			// $('#rsid-select').prop('disabled', false); // Disabling drop-down; Currently unused
			// $('#trait-select').prop('disabled', true);
			$('#rsid-select').find('option').remove();
			var rsids = response['data'];
			// Draw a pie chart using the first trait
			let rsid_list = []
			let curr_trait = rsids[0].trait;
			let curr_rsid = rsids[0].rsid;
			studySearch(curr_trait);
			if (prev_trait != curr_trait) {
				console.log('winning!')
				traitScores(rsids[0].trait);
				prev_trait = curr_trait;
			} else {
				console.log('prev_trait:', prev_trait)
				console.log('curr_trait:', curr_trait)
				console.log('losing :(')
			}

			// Populate select options for a selected rsID
			$(rsids).each(function() {
				var j_data = JSON.stringify(this);
				$('#rsid-select').append($('<option>').attr({"data-value":j_data, "trait": this.trait, "rsid": this.rsid}).text(this.rsid));
				rsid_list.push(this.rsid);
			});

			if (!rsid_list.includes(prev_rsid)) {
				displayPie(rsids[0]);
				prev_rsid = rsids[0].rsid;
				prev_r_obj = rsids[0];
				$('#rsid_search').val(rsids[0]['rsid']);
			}
			// else { # Might need this else statement in the future for reordering of dropdown selection
			// 	console.log(rsids.filter(function (x) {return x.rsid === 'rs1000940'}).indexOf())
			// 	console.log(rsids[0])
			// }

			$('#trait_search').val(rsids[0]['trait']);
			// $('#trait-select').prop('disabled', true); // Disabling drop-down; Currently unused
			// $('#rsid-select').prop('disabled', false);
			$('#rsid-select').formSelect();
			$('#trait-select').formSelect();
		}
	}); 
}

function traitScores(name) {
	$.ajax({
		url: '/getTraitScores/'+encodeURIComponent(name),
		type: 'get',
		dataType: 'json',
		success: function(response) {
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
		},
		prefect: '/traitAutocomplete'
	});
	// console.log(bloodhound);
	$('#trait_search').typeahead({
		limit: 15,
		hint: true,
		highlight: true
	},{
		name: 'traits',
		source: bloodhound,
		display: function(data) {
			return data.trait;
		}
	});

	$('.trait_typeahead').bind('typeahead:select', function(event, input) {
		// Search the selected rsID in the database to create plots
		$('#rsid-select').find('option').remove();
		$('#trait-select').find('option').remove();
		$('#trait-select').append($('<option>').text('Select trait'));
		$('#rsid-select').formSelect();
		$('#trait-select').formSelect();
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
			return data.rsid;
		}
	});

	$('.rsid_typeahead').bind('typeahead:select', function(event, input) {
		// Search the selected rsID in the database to create plots
		$('#rsid-select').find('option').remove();
		$('#trait-select').find('option').remove();
		$('#rsid-select').append($('<option>').text('Select rsID'));
		$('#rsid-select').formSelect();
		$('#trait-select').formSelect();
		rsidSearch(input.rsid);
	});
});

// Populate rsID example data
$(document).ready(function(){
	$('#rsid-example').click(function(){
		// $('#trait-select').prop('disabled', false);
		// $('#rsid-select').prop('disabled', true);
		ex_rsid = 'rs10182181';
		$('#rsid-select').find('option').remove();
		$('#trait-select').find('option').remove();
		$('#rsid-select').append($('<option>').text('Select rsID'));
		$('#rsid-select').formSelect();
		$('#trait-select').formSelect();
		$('#rsid_search').val(ex_rsid);
		rsidSearch(ex_rsid);
	});
});

// Populate trait example data
$(document).ready(function(){
	$('#trait-example').click(function(){
		// $('#rsid-select').prop('disabled', false);
		// $('#trait-select').prop('disabled', true);
		ex_trait = 'Obesity';
		$('#rsid-select').find('option').remove();
		$('#trait-select').find('option').remove();
		$('#trait-select').append($('<option>').text('Select trait'));
		$('#rsid-select').formSelect();
		$('#trait-select').formSelect();
		$('#trait_search').val(ex_trait);
		traitSearch(ex_trait);
	});
});
