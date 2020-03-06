<?php

namespace App\Http\Controllers;

use App\SnpInfo;
use Illuminate\Http\Request;

class SnpInfoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        // $rsids = SnpInfo::select('rsid')->get();

        // return view('test', [
        //     'rsids' => $rsids
        // ]);
        return view('test');
    }
    public function rsidAutocomplete(Request $request) {
        $results =  SnpInfo::where('rsid', 'LIKE', '%'.$request->q.'%')->addSelect('rsid')->distinct()->get();
        return $results;

        // Attempted chunk to limit the # rows returned.
        // Couldn't resolve 500 error. Will try later.
    }
    public function traitAutocomplete(Request $request) {
        $results =  SnpInfo::where('trait', 'LIKE', $request->q.'%')->addSelect('trait')->distinct()->get();
        return $results;

        // Attempted chunk to limit the # rows returned.
        // Couldn't resolve 500 error. Will try later.
    }
    public function getTrait($id) {
        $results['data'] = SnpInfo::where('rsid', $id)->get();
        echo json_encode($results);
        exit;
    }
    public function getRsid($trait) {
        $results['data'] = SnpInfo::where('trait', $trait)->get();
        echo json_encode($results);
        exit;
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\SnpInfo  $snpInfo
     * @return \Illuminate\Http\Response
     */
    public function show(SnpInfo $snpInfo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\SnpInfo  $snpInfo
     * @return \Illuminate\Http\Response
     */
    public function edit(SnpInfo $snpInfo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\SnpInfo  $snpInfo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SnpInfo $snpInfo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\SnpInfo  $snpInfo
     * @return \Illuminate\Http\Response
     */
    public function destroy(SnpInfo $snpInfo)
    {
        //
    }
}
