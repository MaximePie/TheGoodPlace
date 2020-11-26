import React from 'react';
import server from "../../server";

import UploadButton from "../atoms/UploadButton"

export default function CreatePost({}) {

  const [form, setForm] = React.useState({});

  return (
    <div className="CreatePost">
      <h1>Atelier création</h1>
      <form>
        <div className="CreatePost__head">
          <p>
            <input
              value={form.title}
              onChange={(event) => {
                updateForm(event.target.value, 'title')
              }}
              type="text"
              placeholder="Titre de l'article"
              className="CreatePost__title"
            />
          </p>
          <p>
            <input
              value={form.description}
              onChange={(event) => {
                updateForm(event.target.value, 'description')
              }}
              type="text"
              placeholder="Description"
              className="CreatePost__description"
            />
          </p>
          <UploadButton
            onChange={addBanner}
            text="Banière"
          />
          {form.banner && (
            <span className="CreatePost__previewed-banner-container">
              <span className="CreatePost__remove-banner-button" onClick={removeBanner}>x</span>
              <img
                className="CreatePost__previewed-banner"
                src={URL.createObjectURL(form.banner)}
                alt={form.title}
              />
            </span>
          )}
        </div>
        <p>
        {form.sections?.map(section => {
          return (
            <div className="CreatePost__section" key={`section-${section.order}`}>
              <p>
                <input
                  className="CreatePost__section-title"
                  type="text"
                  value={section.title}
                  onChange={(event) => updateSection('title', event.target.value, section.order)}
                  placeholder={`Titre de la section ${section.order}`}
                />
              </p>
              <p>
                <input
                  className="CreatePost__section-description"
                  type="text"
                  value={section.description}
                  onChange={(event) => updateSection('description', event.target.value, section.order)}
                  placeholder={`Description de la section ${section.order}`}
                />
              </p>
              <div className="CreatePost__order-container">
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    updateSection('order', section.order + 1, section.order)
                  }}
                >
                  <i className="fas fa-caret-up"/>
                </button>
                <button onClick={(event) => {
                  event.preventDefault();
                  updateSection('order', section.order - 1, section.order)
                }}
                >
                  <i className="fas fa-caret-down"/>
                </button>
                <i
                  className="fas fa-images CreatePost__add-image"
                  onClick={(event) => addImageToSection(section.order, event)}
                />
              </div>

              {section.images?.map((image, index) => (
                <UploadButton
                  onChange={(event) => {
                    updateImages(section.order, index, event.target.files[0])
                  }}
                  text={`Image ${index + 1}`}
                  key={`image-${section.order}.${index}`}
                />
              ))}
            </div>
          )
        })}
          <button
            className="CreatePost__create-section-button"
            onClick={(event) => addSection(event)}
          >
            <i className="CreatePost__create-section-button-icon fas fa-plus"/>
          </button>
        </p>
      </form>
      <button onClick={createPost}>Créer</button>
      <div>
        {Object.entries(form).map(([key, value]) => {

          if (key === 'sections') {
            return form.sections.map(section => <p>{section.title} : {section.description} : {section.order}</p>)
          } else if (key !== 'banner') {
            return (
              <p>{value}</p>
            )
          }
        })}
      </div>
    </div>
  );

  /**
   * Updates the form with the given informations
   * @param newValue The value to append to the form
   * @param field The field we want to modify
   */
  function updateForm(newValue, field) {
    setForm({...form, [field]: newValue})
  }

  /**
   * Adds a section on the form
   */
  function addSection(event) {
    event.preventDefault();
    const sectionArray = form.sections || [];
    let order = 1;
    if (form.sections) {
      const ordersList = form.sections.map(o => o['order']);
      order = ordersList.reduce((accumulator, currentValue) => Math.max(accumulator, currentValue)) + 1;
    }
    sectionArray.push({
      title: '',
      description: '',
      order: order || 1,
      images: [],
    });
    updateForm(sectionArray, 'sections');
  }

  /**
   * Create a local url to display preview image banner
   * And update the form
   * @param event
   */
  function addBanner(event) {
    URL.createObjectURL(event.target.files[0]);
    updateForm(event.target.files[0], 'banner')
  }

  /**
   * Removes the given banner
   */
  function removeBanner() {
    updateForm(null, "banner");
  }

  /**
   * Add an image spot to a section
   */
  function addImageToSection(sectionOrder, event) {
    event.preventDefault();

    // Find the section to add an image to
    const currentSection = form.sections.find(section => section.order === sectionOrder)

    // Get the images array of this section

    const currentImages = currentSection.images ? [...currentSection.images] : [];

    // Push the image spot
    currentImages.push(null);

    // Update the section
    updateSection('images', currentImages, sectionOrder);
  }


  /**
   * Updates the given section with a new value
   */
  function updateSection(field, newValue, sectionOrder) {
    const initialSection = form.sections.find(section => section.order === newValue);


    // Get the current section value
    const currentSection = form.sections.find(section => section.order === sectionOrder);

    // Create the new current Section
    const updatedSection = {...currentSection, [field]: newValue};


    // Insert it in the array of sections
    const indexOfCurrentSection = form.sections.indexOf(currentSection);

    let updatedSectionsArray = [...form.sections];
    updatedSectionsArray[indexOfCurrentSection] = updatedSection;

    if (field === 'order') {
      // If no section is found at this order, return, because it is already the extreme one.
      if (!initialSection || newValue < 0) {
        return
      }

      const indexOfInitialSection = form.sections.indexOf(initialSection);
      updatedSectionsArray[indexOfInitialSection] = {...initialSection, order: sectionOrder};
    }

    updateForm(updatedSectionsArray, 'sections');
  }

  /**
   * Updates the array of the images of the given section
   */
  function updateImages(sectionOrder, imageIndex, file) {
    // Get the current section
    const currentSection = findSection(sectionOrder);

    // Get the current image array
    let imagesArray = [...currentSection.images];

    // Set the current image at given index
    imagesArray[imageIndex] = file;

    // Update form
    updateSection('images', imagesArray, sectionOrder);
  }

  /**
   * Send all data to the server
   */
  function createPost() {

    server.post('post', {
      'title': form.title,
      'description': form.description,
      'sections': form.sections,
    }).then((response) => {
      const post = response.data.post;
      post.sections?.forEach(section => {

        // Find the images for the corresponding section
        const sectionImages = form.sections.find(formSection => section.order === formSection.order);

        sectionImages.images?.forEach(image => {
          createImage(image, section.title, section.id, 'sectionImage');
        });
      });

      if (form.banner) {
        createImage(form.banner, form.title, post.id, 'banner');
      }
    });
  }

  /**
   * Creates an image and assign it to its parent
   */
  function createImage(file, fileName, parentId, type) {
    let data = new FormData();
    data.append('file', file);
    data.append('name', fileName);
    data.append('type', type);
    data.append('parentId', parentId);

    server.post('post/image', data).then((response) => {
      setForm({});
    });

  }

  /**
   * Remove image preview display from section
   */
  function removePreviewImageFromSection(imageIndex, sectionOrder) {
    // Find the section
    const currentSection = {...findSection(sectionOrder)};

    // Find the image from index
    const currentImages = [...currentSection.images];
    currentImages[imageIndex] = null;

    // Update the section
    updateSection('images', currentImages, sectionOrder);
  }

  /**
   * Little helper to find a section in a easier way
   */
  function findSection(sectionOrder) {
    return form.sections.find(section => section.order === sectionOrder);
  }

  //
  // /**
  //  * Returns an array of the sections sorted by their order
  //  * Doe
  //  */
  // function sortedFormSectionsByOrder() {
  //   const sortedSections = form.sections?.sort((a, b) => {
  //     if (a.order < b.order) {
  //       return -1;
  //     }
  //     else {
  //       return 1;
  //     }
  //   });
  //
  //   return sortedSections || []
  // }
}
