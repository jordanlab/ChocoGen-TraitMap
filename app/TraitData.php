<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property string $trait
 * @property string $cho
 * @property string $clm
 */
class TraitData extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'TraitData';

    /**
     * @var array
     */
    protected $fillable = ['trait', 'cho', 'clm'];

}
