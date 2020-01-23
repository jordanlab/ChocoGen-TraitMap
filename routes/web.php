<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use Illuminate\Support\Facades\Input;
use App\SnpInfo;

Route::get('/', function () {
    return view('main');
});

Route::get('rsidAutocomplete','SnpInfoController@rsidAutocomplete')->name('rsidAutocomplete');
Route::get('traitAutocomplete','SnpInfoController@traitAutocomplete')->name('traitAutocomplete');
Route::get('getTrait/{id}','SnpInfoController@getTrait');
Route::get('getRsid/{id}','SnpInfoController@getRsid');
Route::get('getTraitScores/{name}','TraitDataController@getTraitScores');
Route::get('rsidStudyInfo/{id}','StudyInfoController@rsidStudyInfo');
Route::get('traitStudyInfo/{trait}','StudyInfoController@traitStudyInfo');