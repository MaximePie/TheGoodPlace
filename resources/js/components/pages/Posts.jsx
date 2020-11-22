import React, {useEffect} from 'react';
import {Link} from "react-router-dom";
import server from "../../server";

export default function Posts({}) {

  const [posts, setPosts] = React.useState([]);

  useEffect(fetchPosts, []);

  return (
    <div className="Posts">
      <h1 className="Posts__header">Nouveautés dans The Good Place</h1>
      {posts.map(post => (
        <Link to={`/posts/${post.id}`} className="Posts__post-link">
          <div className="Posts__post">
            <img src={post.banner} alt="" className="Posts__post-illustration"/>
            <div className="Posts__post-details">
              <h2 className="Posts__post-title">{post.title}</h2>
              <p className="Posts__post-description">{post.description}</p>
            </div>
          </div>
        </Link>
      ))}
      <div>
        <Link to={'/createPost'}>Créer un article</Link>
      </div>
    </div>
  );

  /**
   * Fetch the Posts and set it
   */
  function fetchPosts() {
    server.get('posts').then((response) => {
      const {posts} = response.data;
      if (posts) {
        setPosts(posts)
      }
    })
  }

  /**
   * Send all data to the server
   */
  function createPost() {
    server.post('post', {
      'title': 'Mon titre',
      'description': 'Ma description',
      'banner': 'demenagement.jpg',
      'sections': [
        {
          'title': 'Titre de section 2',
          'description' : 'Description de section 2',
          'order': 2,
          'images': ['demenagement1.jpg', 'demenagement2.jpg'],
        },
        {
          'title': 'Titre de section 1',
          'description' : 'Description de section 1',
          'order': 1,
        },
      ]
    }).then((response) => {
      console.log(response);
      fetchPosts();
    });
  }
}
