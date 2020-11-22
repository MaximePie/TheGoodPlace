<?php

namespace App\Http\Controllers;

use App\Image;
use App\Post;
use App\Section;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return JsonResponse
   */
  public function index()
  {
    $posts = Post::all();
    return response()->json(['posts' => Post::all()]);
  }

  /**
   * Show the form for creating a new resource.
   *
   * @return void
   */
  public function create()
  {
    //
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param Request $request
   * @return JsonResponse
   */
  public function store(Request $request)
  {
    /** @var Post $post */
    $post = Post::create([
      'title' => $request->title,
      'description' => $request->description,
      'banner' => '',
    ]);

    if ($request->sections) {
      foreach($request->sections as $section) {
        Section::create([
          'title' => $section['title'],
          'description' => $section['description'],
          'order' => $section['order'],
          'post_id' => $post->id,
        ]);
      }
    }

    $post['sections'] = $post->sections()->get();

    return response()->json(['post' => $post]);
  }

  public function storeImage(Request $request) {
    $path = $request->file('file')->store('images', 's3');
    if ($request->type === 'banner') {
      $post = Post::findOrFail($request->parentId);
      $post->banner = Storage::disk('s3')->url($path);
      $post->save();
      return response()->json(['post' => $post, 'path' => Storage::disk('s3')->url($path)]);
    }
    else {
      return Image::create(['name' => Storage::disk('s3')->url($path), 'section_id' => $request->parentId] );
    }
  }

  /**
   * Display the specified resource.
   *
   * @param Post $post
   * @return Response
   */
  public function show(Post $post)
  {
    $post['sections'] = $post->sections()->get();
    $post['sections']->each(function(Section $section) {
      $section['images'] = $section->images()->get();
    });
    return response()->json(['post' => $post]);
  }

  /**
   * Show the form for editing the specified resource.
   *
   * @param Post $post
   * @return Response
   */
  public function edit(Post $post)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   *
   * @param Request $request
   * @param Post $post
   * @return Response
   */
  public function update(Request $request, Post $post)
  {
    //
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param Post $post
   * @return Response
   */
  public function destroy(Post $post)
  {
    //
  }
}
