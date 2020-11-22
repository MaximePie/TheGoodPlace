import React from 'react';
import server from "../../server";

export default function CreatePost({}) {

  const [form, setForm] = React.useState({
    title: "Haha",
    description: "Haha",
    banner: "",
    sections: [
      {
        title: "First section",
        description: "First desc",
        order: 1,
      },
      {
        title: "Second section",
        description: "Second desc",
        order: 2,
      }
    ]
  });

  return (
    <div className="CreatePost">
      <h1>Créez votre propre article</h1>
      <form action="">
        <p>
          <input value={form.title} onChange={(event) => {
            updateForm(event.target.value, 'title')
          }} type="text" placeholder="Titre"/>
        </p>
        <p>
          <input value={form.description} onChange={(event) => {
            updateForm(event.target.value, 'description')
          }} type="text" placeholder="Description"/>
        </p>
        <p>
          <label>Banière</label>
          <input type="file" onChange={(event) => {
            updateForm(event.target.files[0], 'banner')
          }}/>
        </p>
        <p>
          <button onClick={(event) => addSection(event)}>Créer nouvelle section</button>
        </p>
        {form.sections?.map(section => {

          console.log(section);
          return (
            <div className="CreatePost__section">
              <p>
                <label>Titre</label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(event) => updateSection('title', event.target.value, section.order)}
                  placeholder={`Titre de la section ${section.order}`}
                />
              </p>
              <p>
                <label>Description</label>
                <input
                  type="text"
                  value={section.description}
                  onChange={(event) => updateSection('description', event.target.value, section.order)}
                  placeholder={`Description de la section ${section.order}`}
                />
              </p>
              <p>
                <label>Ordre</label>
                <input
                  type="text"
                  value={section.order}
                  onChange={(event) => updateSection('order', event.target.value, section.order)}
                  placeholder={`Ordre de la section ${section.order}`}
                />
              </p>

              {section.images?.map((image, index) => (
                <p>
                  <label>Image</label>
                  <input type="file" onChange={(event) => {
                    updateImages(section.order, index, event.target.files[0])
                  }}/>
                </p>
              ))}

              <button onClick={(event) => addImageToSection(section.order, event)}>Ajouter une image</button>
            </div>
          )
        })}
      </form>
      <button onClick={createPost}>Créer</button>
      <div>
        {Object.entries(form).map(([key, value]) => {

          if (key === 'sections') {
            return form.sections.map(section => <p>{section.title} : {section.description} : {section.order}</p>)
          } else if (key !== 'banner') {
            return (
              <p>{key} : {value}</p>
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
      title: 'section',
      description: 'description',
      order: order || 1,
      images: [],
    });
    updateForm(sectionArray, 'sections');
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

    // Set the current section value
    const currentSection = form.sections.find(section => section.order === sectionOrder);

    // Create the new current Section
    const updatedSection = {...currentSection, [field]: newValue};


    // Insert it in the array of sections
    const indexOfCurrentSection = form.sections.indexOf(currentSection);

    let updatedSectionsArray = [...form.sections];
    updatedSectionsArray[indexOfCurrentSection] = updatedSection;
    updateForm(updatedSectionsArray, 'sections');
  }

  /**
   * Updates the array of the images of the given section
   */
  function updateImages(sectionOrder, imageIndex, file) {
    // Get the current section
    const currentSection = form.sections.find(section => section.order === sectionOrder);

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
      'sections': [
        {
          'title': 'Titre de section 2',
          'description': 'Description de section 2',
          'order': 2,
          // 'images': ['demenagement1.jpg', 'demenagement2.jpg'],
        },
        {
          'title': 'Titre de section 1',
          'description': 'Description de section 1',
          'order': 1,
        },
      ]
    }).then((response) => {
      const post = response.data.post;

      console.log(post);
      post.sections?.forEach(section => {
        console.log(1);

        // Find the images for the corresponding section
        const sectionImages = form.sections.find(formSection => section.order === formSection.order);

        sectionImages.images?.forEach(image => {
          console.log(2);
          createImage(image, section.title, section.id, 'sectionImage');
        });
      })
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
}