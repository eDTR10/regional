/* Cache-first service worker for the face-api model files ONLY.
   Requests outside /regional/models/ are never intercepted, so the rest
   of the app keeps its normal online behavior. */

const CACHE_NAME = "edtr-face-models-v1";
const MODELS_PATH = "/regional/models/";

// The models the biometric screen actually loads — precached on install so
// recognition keeps working when the device later goes offline.
const MODEL_FILES = [
  "tiny_face_detector_model-weights_manifest.json",
  "tiny_face_detector_model-shard1",
  "face_landmark_68_tiny_model-weights_manifest.json",
  "face_landmark_68_tiny_model-shard1",
  "face_recognition_model-weights_manifest.json",
  "face_recognition_model-shard1",
  "face_recognition_model-shard2",
  "face_expression_model-weights_manifest.json",
  "face_expression_model-shard1",
].map((file) => MODELS_PATH + file);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(MODEL_FILES))
      // If precaching fails (e.g. installed while offline), files are still
      // cached lazily by the fetch handler the next time they load online.
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("edtr-face-models-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(MODELS_PATH)) {
    return; // not a model file — let the browser handle it normally
  }
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then(
        (cached) =>
          cached ||
          fetch(event.request).then((response) => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          })
      )
    )
  );
});
