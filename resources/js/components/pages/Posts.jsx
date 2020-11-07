import React from 'react';
import {Link} from "react-router-dom";
import postsData from '../../data/posts'

export default function Posts({}) {

  const postsList = Object.values(postsData);

  return (
    <div className="Posts">
      <h1 className="Posts__header">Nouveautés dans The Good Place</h1>
      {postsList.map(post => (
        <Link to={`/posts/${post.id}`} className="Posts__post-link">
        <div className="Posts__post">
            <img src={`/../../images/${post.banner}`} alt="" className="Posts__post-illustration"/>
            <div className="Posts__post-details">
              <h2 className="Posts__post-title">{post.title}</h2>
              <p className="Posts__post-description">{post.description}</p>
            </div>
        </div>
        </Link>
      ))}
    </div>
  );
}
