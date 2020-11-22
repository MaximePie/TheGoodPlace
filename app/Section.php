<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
  protected $fillable = ['title', 'description', 'order', 'post_id'];
  public $timestamps = false;

  /**
   * Returns the list of the images assigned to this section
   */
  public function images()
  {
    return $this->hasMany('App\Image');
  }

}
