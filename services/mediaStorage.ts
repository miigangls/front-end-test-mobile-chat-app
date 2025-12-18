import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

function mediaDir() {
  return `${FileSystem.documentDirectory}media/`;
}

async function ensureDir() {
  const dir = mediaDir();
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  return dir;
}

export async function persistPickedImage(params: { uri: string }) {
  const dir = await ensureDir();
  const id = `${Date.now()}`;

  const full = await ImageManipulator.manipulateAsync(
    params.uri,
    [{ resize: { width: 1280 } }],
    { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
  );
  const fullDest = `${dir}${id}.jpg`;
  await FileSystem.copyAsync({ from: full.uri, to: fullDest });

  const thumb = await ImageManipulator.manipulateAsync(
    params.uri,
    [{ resize: { width: 320 } }],
    { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
  );
  const thumbDest = `${dir}${id}.thumb.jpg`;
  await FileSystem.copyAsync({ from: thumb.uri, to: thumbDest });

  const fullInfo = await FileSystem.getInfoAsync(fullDest, { size: true });

  return {
    mediaUri: fullDest,
    thumbnailUri: thumbDest,
    mimeType: 'image/jpeg',
    sizeBytes: fullInfo.size ?? 0,
  };
}

export async function deleteMediaFiles(params: { mediaUri?: string | null; thumbnailUri?: string | null }) {
  const candidates = [params.mediaUri, params.thumbnailUri].filter(Boolean) as string[];
  await Promise.all(
    candidates.map(async (uri) => {
      try {
        const info = await FileSystem.getInfoAsync(uri);
        if (info.exists) await FileSystem.deleteAsync(uri, { idempotent: true });
      } catch {
      }
    })
  );
}


