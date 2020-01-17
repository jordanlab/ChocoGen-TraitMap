<?php

namespace App\Http\Controllers;

use App\StudyInfo;
use Illuminate\Http\Request;

class StudyInfoController extends Controller
{
    public function rsidStudyInfo($id) {
    	$results['data'] = StudyInfo::where('rsid', $id)->get();
    	echo json_encode($results);
    	exit;
    }

    public function traitStudyInfo($trait) {
    	$results['data'] = StudyInfo::where('trait', $trait)->get();
    	echo json_encode($results);
    	exit;
    }
}
