import React, {useCallback, useState} from 'react';
import {useParams} from "react-router";
import ImageViewer from 'react-simple-image-viewer';
import server from "../../server";

export default function Post({}) {

  const {id: postId} = useParams();

  const [post, setPost] = React.useState({});

  React.useEffect(() => {
    fetchPost();
  }, [postId]);

  const picturesList = picturesFromData();

  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <div className="Post">
      <div className="Post__banner-container">
        <img src={`/storage/${post.banner}`} alt="Bannière" className="Post__banner"/>
      </div>
      <h1 className="Post__title">{post.title}</h1>
      <p>{post.description}</p>
      {post.sections?.map(section => (
        <div>
          <h2>{section.title}</h2>
          <p>{section.description}</p>
          {section.images?.map(picture => {
            const index = picturesList.indexOf(`/storage/${picture.name}`);
            return (
              <img
                className={'Post__section-illustration'}
                src={`/storage/${picture.name}`}
                alt={picture.name}
                onClick={() => openImageViewer(index)}
              />
            )
          })}

          {isViewerOpen && (
            <ImageViewer
              src={picturesList}
              currentIndex={currentImage}
              onClose={closeImageViewer}
            />
          )}
        </div>
      ))}
    </div>
  );

  /**
   * Returns an array containing all pictures in the data
   */
  function picturesFromData() {
    const pictures = [];

    pictures.push(`/storage/${post.banner}`);

    post.sections?.forEach(section => {
      section.images?.forEach(picture => {
        pictures.push(`/storage/${picture.name}`);
      })
    });

    return pictures;
  }

  /**
   * Fetch the Post and set it
   */
  function fetchPost() {
    if (postId) {
      server.get(`post/${postId}`).then((response) => {
        const {post} = response.data;
        if (post) {
          setPost(post)
        }
      })
    }
  }
}
