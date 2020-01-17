<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $pubmed_id
 * @property string $author
 * @property string $journal
 * @property string $link
 * @property string $title
 * @property string $trait
 * @property string $rsid
 * @property string $allele
 */
class StudyInfo extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'StudyInfo';

    /**
     * @var array
     */
    protected $fillable = ['pubmed_id', 'author', 'journal', 'link', 'title', 'trait', 'rsid', 'allele'];

}
