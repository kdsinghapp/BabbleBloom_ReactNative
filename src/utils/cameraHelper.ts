import { Platform } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import type { Asset, ImagePickerResponse, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';
import { requestCameraPermissions } from '../Api';

const MODAL_CLOSE_DELAY_MS = 400;

const defaultOptions: CameraOptions & ImageLibraryOptions = {
  mediaType: 'photo' as const,
  quality: 0.8 as const,
};

export type OpenCameraResult = { asset: Asset } | { cancelled: true } | { error: string };

/**
 * Handle image picker response common to both camera and gallery.
 */
function handleResponse(response: ImagePickerResponse, onResult: (result: OpenCameraResult) => void) {
  if (response.didCancel) {
    onResult({ cancelled: true });
    return;
  }
  if (response.errorCode) {
    const message =
      response.errorCode === 'permission'
        ? 'Permission denied'
        : response.errorMessage ?? 'An error occurred';
    onResult({ error: message });
    return;
  }
  const asset = response.assets?.[0];
  if (asset?.uri) {
    onResult({ asset });
  } else {
    onResult({ error: 'No image selected' });
  }
}

/**
 * Request camera permission (Android), then open camera after a short delay
 * so any visible modal can close first. Handles cancel and errors.
 */
export async function openCamera(
  onResult: (result: OpenCameraResult) => void
): Promise<void> {
  if (Platform.OS === 'android') {
    const granted = await requestCameraPermissions();
    if (!granted) {
      onResult({ error: 'Camera permission is required' });
      return;
    }
  }

  // Let modal close before opening camera
  setTimeout(() => {
    launchCamera({ ...defaultOptions, cameraType: 'back' }, (response) => handleResponse(response, onResult));
  }, MODAL_CLOSE_DELAY_MS);
}

/**
 * Open image gallery to select a photo.
 */
export async function openGallery(
  onResult: (result: OpenCameraResult) => void
): Promise<void> {
  // Let modal close before opening gallery
  setTimeout(() => {
    launchImageLibrary(defaultOptions, (response) => handleResponse(response, onResult));
  }, MODAL_CLOSE_DELAY_MS);
}

