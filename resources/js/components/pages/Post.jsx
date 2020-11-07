import React, {useCallback, useState} from 'react';
import {useParams} from "react-router";
import postsList from '../../data/posts.json';
import ImageViewer from 'react-simple-image-viewer';

export default function Post({}) {

  const {id} = useParams();
  const {id: postId, banner, title, description, sections} = Object.values(postsList).find(post => post.id == id);

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

  console.log(picturesList);

  return (
    <div className="Post">
      <div className="Post__banner-container">
        <img src={`/../../images/${banner}`} alt="Bannière" className="Post__banner"/>
      </div>
      <h1 className="Post__title">{title}</h1>
      <p>{description}</p>
      {sections?.map(section => (
        <div>
          <h2>{section.title}</h2>
          <p>{section.description}</p>
          {section.pictures?.map(picture => {
            const index = picturesList.indexOf('/../../images/' + picture);
            console.log(index);
            return (
              <img
                className={'Post__section-illustration'}
                src={`/../../images/${picture}`}
                alt={picture}
                onClick={ () => openImageViewer(index) }
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

    pictures.push('/../../images/' + banner);

    sections?.forEach(section => {
      section.pictures?.forEach(picture => {
        pictures.push('/../../images/' + picture);
      })
    });

    return pictures;
  }
}
