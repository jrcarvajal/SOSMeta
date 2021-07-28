import React, { createContext, useState, useEffect } from 'react';
import { getBackup } from '../utils/backup';

const Context = createContext();

export const CreateProvider = ({ children }) => {
  const [type, setType] = useState(null);
  const [entity, setEntity] = useState(null);
  const [description, setDescription] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [coords, setCoords] = useState([-73.64706, 4.160807]);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    getBackup().then((data) => {
      if (data.description) {
        setDescription(data.description);
      }
      if (data.type) {
        setType(parseInt(data.type));
      }
      if (data.entity) {
        setEntity(parseInt(data.entity));
      }
      if (data.photos) {
        setPhotos(data.photos);
      }
      if (data.coords) {
        setCoords(data.coords.map((item) => parseFloat(item)));
      }
      if (data.video) {
        setVideo(data.video);
      }
    });
  }, []);

  const value = {
    type,
    entity,
    description,
    photos,
    coords,
    video,
    changeType: (id) => {
      setType(id);
    },
    changeEntity: (id) => {
      setEntity(id);
    },
    changeDescription: (value) => {
      setDescription(value);
    },
    addPhoto: (photo) => {
      setPhotos([...photos, photo]);
    },
    removePhoto: (photo) => {
      setPhotos((state) => {
        const newPhotos = state.filter(
          (ph) => ph.node.image.uri !== photo.node.image.uri,
        );
        return newPhotos;
      });
    },
    addPhotos: (newPhotos) => {
      setPhotos([...photos, ...newPhotos]);
    },
    changeCoords: (coords) => {
      setCoords(coords);
    },
    changeVideo: (video) => {
      setVideo(video);
    },
    removeVideo: () => {
      setVideo(null);
    },
    resetAll: () => {
      setType(null);
      setDescription(null);
      setPhotos([]);
      setVideo(null);
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
export default Context;
