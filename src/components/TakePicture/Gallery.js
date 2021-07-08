import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useReducer,
} from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { FlatList, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import CameraRoll from '@react-native-community/cameraroll';
import GalleryPhoto from './GalleryPhoto';
import GalleryVideo from './GalleryVideo';
import ArrowLeft from '../Icons/ArrowLeft';
import { theme } from '../../theme';
import { hasStoragePermissions } from '../../permissions';
import NotAuthorized from './CameraElements/NotAuthorized';
import { normalize } from '../../utils/fonts';
import Video from 'react-native-video';

const initialState = {
  photos: [],
  videos: [],
  loadingMore: false,
  pagePhotos: null,
  pageVideos: null,
  error: null,
};
const TYPES = {
  ADD_PHOTOS: 'add_photos',
  ADD_VIDEOS: 'add_videos',
  REQUEST_PHOTOS: 'request_photo',
  REQUEST_VIDEOS: 'request_videos',
  ERROR: 'error',
};
const reducer = (state, action) => {
  switch (action.type) {
    case TYPES.REQUEST_PHOTOS:
      return {
        ...state,
        loadingMore: true,
      };
    case TYPES.REQUEST_VIDEOS:
      return {
        ...state,
        loadingMore: true,
      };
    case TYPES.ADD_PHOTOS:
      return {
        ...state,
        error: null,
        loadingMore: false,
        pagePhotos: action.payload.page,
        photos: [...state.photos, ...action.payload.photos],
      };
    case TYPES.ADD_VIDEOS:
      return {
        ...state,
        error: null,
        loadingMore: false,
        pageVideos: action.payload.page,
        videos: [
          ...state.videos,
          ...action.payload.videos.filter(
            (video) => video.node.image.fileSize < 80 * 1024 * 1024,
          ),
        ],
      };
    case TYPES.ERROR:
      return {
        ...state,
        loadingMore: false,
        error: true,
      };
    default:
      return state;
  }
};
const Gallery = ({
  selectedPhotos,
  confirmedPhotos,
  eventsOpen,
  confirmSelection,
  discardPhotos,
  addToSelectedPhotos,
  removeFromSelectedPhotos,
  storageAllowed,
  changeStorageToAllowed,
  confirmedVideo,
  selectedVideo,
  addVideo,
  removeVideo,
}) => {
  const NUMBER_OF_PHOTOS = 50;
  const { height } = Dimensions.get('window');
  const [enabled, setEnabled] = useState();
  const [type, setType] = useState('photo');
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(1);
  const panRef = useRef(null);
  const scrollViewRef = useRef(null);

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getGalleryPhotos();
    getGalleryVideos();
  }, []);

  useEffect(() => {
    if (eventsOpen[eventsOpen.length - 1] === 1) {
      open();
    } else {
      close();
    }
  }, [eventsOpen]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          translateY: height * translateY.value,
        },
      ],
    };
  });

  async function getGalleryPhotos() {
    const { allowed } = await hasStoragePermissions();
    if (allowed) {
      changeStorageToAllowed();
      dispatch({
        type: TYPES.REQUEST_PHOTOS,
      });
      const fetchParams = {
        first: NUMBER_OF_PHOTOS,
        assetType: 'Photos',
      };
      if (state.pagePhotos?.has_next_page) {
        fetchParams.after = state.pagePhotos.end_cursor;
      }
      if (state.pagePhotos === null || state.pagePhotos.has_next_page) {
        CameraRoll.getPhotos(fetchParams).then((data) => {
          dispatch({
            type: TYPES.ADD_PHOTOS,
            payload: { photos: data.edges, page: data.page_info },
          });
        });
      }
    } else {
      dispatch({
        type: TYPES.ERROR,
      });
    }
  }
  async function getGalleryVideos() {
    const { allowed } = await hasStoragePermissions();
    if (allowed) {
      changeStorageToAllowed();
      dispatch({
        type: TYPES.REQUEST_VIDEOS,
      });
      const fetchParams = {
        first: NUMBER_OF_PHOTOS / 2,
        assetType: 'Videos',
        include: ['fileSize'],
      };
      if (state.pageVideos?.has_next_page) {
        fetchParams.after = state.pageVideos.end_cursor;
      }
      if (state.pageVideos === null || state.pageVideos.has_next_page) {
        CameraRoll.getPhotos(fetchParams).then((data) => {
          dispatch({
            type: TYPES.ADD_VIDEOS,
            payload: { videos: data.edges, page: data.page_info },
          });
        });
      }
    } else {
      dispatch({
        type: TYPES.ERROR,
      });
    }
  }

  const open = useCallback(() => {
    opacity.value = withTiming(1, {
      duration: 450,
      easing: Easing.ease,
    });
    translateY.value = withTiming(0, {
      duration: 450,
      easing: Easing.ease,
    });
  });

  const close = useCallback(() => {
    opacity.value = withTiming(0, {
      duration: 450,
      easing: Easing.ease,
    });
    translateY.value = withTiming(1, {
      duration: 450,
      easing: Easing.ease,
    });
  });

  const onOk = useCallback(() => {
    confirmSelection();
  });

  const onCancel = useCallback(() => {
    discardPhotos();
  });

  const onPhotosEndReached = () => {
    if (state.pagePhotos) {
      getGalleryPhotos();
    }
  };

  const onVideosEndReached = () => {
    if (state.pageVideos) {
      getGalleryVideos();
    }
  };

  const GalleryPhotoMemoized = ({ item }) => {
    const selected =
      selectedPhotos.filter(
        (image) => image.node.image.uri === item.node.image.uri,
      ).length > 0 ||
      confirmedPhotos.filter(
        (image) => image.node.image.uri === item.node.image.uri,
      ).length > 0;
    return (
      <GalleryPhoto
        photo={item}
        selected={selected}
        addPhoto={addToSelectedPhotos}
        removePhoto={removeFromSelectedPhotos}
      />
    );
  };

  const GalleryVideoMemoized = ({ item }) => {
    const selected = selectedVideo
      ? item?.node?.image?.uri === selectedVideo?.node?.image.uri
      : item?.node?.image?.uri === confirmedVideo?.node?.image.uri;
    return (
      <GalleryVideo
        video={item}
        selected={selected}
        addVideo={addVideo}
        removeVideo={removeVideo}
      />
    );
  };

  const changeToPhoto = useCallback(() => {
    setType('photo');
  }, [setType]);

  const changeToVideo = useCallback(() => {
    setType('video');
  }, [setType]);

  return (
    <PanGestureHandler
      ref={panRef}
      simultaneousHandlers={scrollViewRef}
      onGestureEvent={(e) => {
        if (e.nativeEvent.translationY > 0) {
          const maxTranslation = height;
          const percentage =
            maxTranslation - e.nativeEvent.translationY > 0
              ? e.nativeEvent.translationY / maxTranslation
              : 1;
          opacity.value = withSpring(1 - percentage);
          translateY.value = withSpring(percentage);
        }
      }}
      onHandlerStateChange={(e) => {
        if (translateY.value > 0.2) {
          opacity.value = withSpring(0);
          translateY.value = withSpring(1);
        } else {
          opacity.value = withSpring(1);
          translateY.value = withSpring(0);
        }
        setEnabled(true);
      }}>
      <Animated.View style={[styles.container, animatedStyles]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable onPress={onCancel}>
              <ArrowLeft color="white" />
            </Pressable>
            {selectedPhotos.length > 0 && (
              <Text style={styles.headerText}>
                {selectedPhotos.length} seleccionado
                {selectedPhotos.length > 1 ? 's' : ''}
              </Text>
            )}
          </View>
          <Pressable onPress={onOk}>
            <Text style={styles.okButton}>OK</Text>
          </Pressable>
        </View>
        <View style={styles.options}>
          <Pressable
            onPress={changeToPhoto}
            style={[styles.buttonLeft, type === 'photo' && styles.active]}>
            <Text>Foto</Text>
          </Pressable>
          <Pressable
            onPress={changeToVideo}
            style={[styles.buttonRight, type === 'video' && styles.active]}>
            <Text>Video</Text>
          </Pressable>
        </View>
        {!storageAllowed ? (
          <NotAuthorized
            type="GALERÍA"
            requestPermission={hasStoragePermissions}
            onSuccess={getGalleryPhotos}
          />
        ) : type === 'photo' ? (
          <FlatList
            ref={scrollViewRef}
            simultaneousHandlers={panRef}
            data={state.photos}
            renderItem={GalleryPhotoMemoized}
            keyExtractor={(photo) => photo.node.image.uri}
            numColumns={4}
            overScrollMode={'never'}
            scrollEnabled={enabled}
            onScroll={(e) => {
              if (e.nativeEvent.contentOffset.y === 0) {
                setEnabled(false);
              } else {
                setEnabled(true);
              }
            }}
            onEndReached={onPhotosEndReached}
            onEndReachedThreshold={20}
          />
        ) : (
          <FlatList
            ref={scrollViewRef}
            simultaneousHandlers={panRef}
            data={state.videos}
            renderItem={GalleryVideoMemoized}
            keyExtractor={(video) => video.node.image.uri}
            numColumns={4}
            overScrollMode={'never'}
            scrollEnabled={enabled}
            onScroll={(e) => {
              if (e.nativeEvent.contentOffset.y === 0) {
                setEnabled(false);
              } else {
                setEnabled(true);
              }
            }}
            onEndReached={onVideosEndReached}
            onEndReachedThreshold={20}
          />
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: theme.colors.orange,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: normalize(17),
    marginLeft: 12,
  },
  okButton: {
    fontWeight: 'bold',
    color: 'white',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonLeft: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  buttonRight: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderLeftWidth: 0,
  },
  active: {
    backgroundColor: '#DADADA',
  },
});
export default Gallery;
