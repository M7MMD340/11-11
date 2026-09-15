import * as ImageManipulator from 'expo-image-manipulator';

// Firestore documents are capped at 1MiB; base64 inflates size by ~33%,
// so we keep the compressed source well under that ceiling.
const MAX_WIDTH = 780;
const JPEG_QUALITY = 0.5;

export async function compressToBase64(localUri: string) {
  const result = await ImageManipulator.manipulateAsync(
    localUri,
    [{ resize: { width: MAX_WIDTH } }],
    { compress: JPEG_QUALITY, format: ImageManipulator.SaveFormat.JPEG, base64: true },
  );
  if (!result.base64) throw new Error('تعذّر تجهيز الصورة');
  return `data:image/jpeg;base64,${result.base64}`;
}
