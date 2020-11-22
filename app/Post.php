<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * @property Carbon created_at
 */
class Post extends Model
{
    protected $fillable = ['title', 'description', 'banner'];

    public $timestamps = false;

    public function __construct(array $attributes = [])
    {
      parent::__construct($attributes);
      $this->created_at = now();
    }

  /**
   * Returns the list of the sections assigned to this post
   */
  public function sections()
  {
    return $this->hasMany('App\Section')->orderBy('order', 'asc');
  }
}
