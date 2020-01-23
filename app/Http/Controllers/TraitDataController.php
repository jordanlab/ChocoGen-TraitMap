<?php

namespace App\Http\Controllers;

use App\TraitData;
use Illuminate\Http\Request;

class TraitDataController extends Controller
{
	public function getTraitScores($name) {
		$results['data'] = TraitData::where('trait', $name)->get();
		echo json_encode($results);
		exit;
	}
}
