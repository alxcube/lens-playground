import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';

export interface ImagePointCallback {
  (point: { x: number; y: number }): void;
}

export const useImagePointsTransportStore = defineStore('imagePointsTransport', () => {
  const requests = shallowRef<ImagePointCallback[]>([]);
  const hasRequests = ref(false);

  const feed = (point: { x: number; y: number }) => {
    while (requests.value.length) {
      const callback = requests.value.shift();
      if (callback) {
        callback(point);
      }
    }
    hasRequests.value = false;
  };

  const cancel = (cb: ImagePointCallback) => {
    const index = requests.value.indexOf(cb);
    if (index >= 0) {
      requests.value.splice(index, 1);
    }
    hasRequests.value = !!requests.value.length;
  };
  const request = (cb: ImagePointCallback) => {
    requests.value.push(cb);
    if (!hasRequests.value) {
      hasRequests.value = true;
    }
    return () => cancel(cb);
  };

  const cancelAll = () => {
    if (requests.value.length) {
      requests.value = [];
    }
    if (hasRequests.value) {
      hasRequests.value = false;
    }
  };

  return {
    requests,
    hasRequests,
    feed,
    request,
    cancel,
    cancelAll
  };
});
