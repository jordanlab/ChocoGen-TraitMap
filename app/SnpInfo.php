<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property string $rsid
 * @property string $trait
 * @property string $eff_allele
 * @property string $maj_allele
 * @property string $min_allele
 * @property int $clm_maj
 * @property int $clm_min
 * @property int $cho_maj
 * @property int $cho_min
 */
class SnpInfo extends Model
{
    /**
     * The table associated with the model.
     * 
     * @var string
     */
    protected $table = 'SnpInfo';

    /**
     * @var array
     */
    protected $fillable = ['rsid', 'trait', 'eff_allele', 'maj_allele', 'min_allele', 'clm_maj', 'clm_min', 'cho_maj', 'cho_min'];
}
