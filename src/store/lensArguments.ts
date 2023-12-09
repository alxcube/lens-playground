import { loadImageFile } from '@/utils/loadImageFile';
import {
  type ColorResamplerFactoriesPoolKeyMap,
  distort,
  DistortionServiceOptions,
  InterpolationMethod,
  type ResampleFilterPreset,
  type ReversePixelMapperFactoriesPoolKeyMap,
  toHTMLCanvasElement,
  VirtualPixelMethod
} from '@alxcube/lens';
import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';

export interface DistortionArgumentsValidationErrors {
  image?: string[];
  distortionName?: string[];
  args?: string[];
  invalidArgs?: number[];
}

export const useLensArgumentsStore = defineStore('lensArguments', () => {
  const sourceImage = shallowRef<HTMLCanvasElement>();
  const sourceImageViewport = ref<{ x1: number; y1: number; x2: number; y2: number }>();
  const distortionName = ref<keyof ReversePixelMapperFactoriesPoolKeyMap | string>();
  const distortionArguments = ref<number[]>([]);
  const imageVirtualPixelMethodOption = ref<VirtualPixelMethod>(VirtualPixelMethod.TRANSPARENT);
  const imageInterpolationMethodOption = ref<InterpolationMethod>(InterpolationMethod.AVERAGE);
  const imageViewportOffsetOption = ref<[number, number]>([0, 0]);
  const imageBackgroundColorOption = ref<string>();
  const resamplerOption = ref<keyof ColorResamplerFactoriesPoolKeyMap | string>('point');
  const filterOption = ref<ResampleFilterPreset>();
  const filterBlurOption = ref<number>();
  const filterWindowSupportOption = ref<number>();
  const outputScalingOption = ref<number>();
  const viewportOption = ref<'bestFit' | { x1: number; y1: number; x2: number; y2: number }>();
  const matteColorOption = ref<string>();
  const isLoadingSourceImage = ref(false);
  const isProcessingDistortion = ref(false);
  const distortedImage = shallowRef<HTMLCanvasElement>();
  const distortionViewport = ref<{ x1: number; y1: number; x2: number; y2: number }>();
  const distortionDuration = ref<number>();
  const distortionError = ref<Error | string>();
  const validationErrors = ref<DistortionArgumentsValidationErrors>({});
  const loadSourceImage = async (file: Blob) => {
    isLoadingSourceImage.value = true;
    sourceImage.value = await loadImageFile(file);
    sourceImageViewport.value = {
      x1: 0,
      y1: 0,
      x2: sourceImage.value.width - 1,
      y2: sourceImage.value.height - 1
    };
    isLoadingSourceImage.value = false;
  };

  const resetDistortionOutput = () => {
    distortedImage.value = undefined;
    distortionViewport.value = undefined;
    distortionDuration.value = undefined;
    distortionError.value = undefined;
  };

  const validateArguments = () => {
    validationErrors.value = {};
    let errorCount = 0;
    if (!sourceImage.value) {
      errorCount++;
      validationErrors.value.image = ['Source image is not set.'];
    }
    if (!distortionName.value) {
      errorCount++;
      validationErrors.value.distortionName = ['Distortion name is not set.'];
    }
    if (errorCount) {
      throw new Error('Invalid distort() arguments.');
    }
  };

  const processDistortion = async () => {
    resetDistortionOutput();
    try {
      validateArguments();
      isProcessingDistortion.value = true;
      const distortionOptions: DistortionServiceOptions = {
        imageBackgroundColor: imageBackgroundColorOption.value,
        imageInterpolationMethod: imageInterpolationMethodOption.value,
        imageViewportOffset: imageViewportOffsetOption.value,
        imageVirtualPixelMethod: imageVirtualPixelMethodOption.value,
        resampler: resamplerOption.value,
        filter: filterOption.value,
        filterBlur: filterBlurOption.value,
        filterWindowSupport: filterWindowSupportOption.value,
        viewport: viewportOption.value,
        matteColor: matteColorOption.value,
        outputScaling: outputScalingOption.value
      };
      const result = await distort(
        sourceImage.value!,
        distortionName.value!,
        distortionArguments.value,
        distortionOptions
      );
      distortedImage.value = toHTMLCanvasElement(await result.image.getResource());
      const { x1, y1, x2, y2 } = result.image.getViewport();
      distortionViewport.value = { x1, y1, x2, y2 };
      distortionDuration.value = result.duration;
    } catch (e) {
      distortionError.value = e as Error | string;
    } finally {
      isProcessingDistortion.value = false;
    }
  };

  const useResultAsSource = () => {
    sourceImage.value = distortedImage.value;
    if (distortionViewport.value) {
      sourceImageViewport.value = { ...distortionViewport.value };
    }
    resetDistortionOutput();
  };

  return {
    sourceImage,
    sourceImageViewport,
    distortionName,
    distortionArguments,
    imageVirtualPixelMethodOption,
    imageInterpolationMethodOption,
    imageViewportOffsetOption,
    imageBackgroundColorOption,
    resamplerOption,
    filterOption,
    filterBlurOption,
    filterWindowSupportOption,
    outputScalingOption,
    viewportOption,
    matteColorOption,
    isLoadingSourceImage,
    isProcessingDistortion,
    distortedImage,
    distortionViewport,
    distortionDuration,
    distortionError,
    validationErrors,
    validateArguments,
    loadSourceImage,
    resetDistortionOutput,
    processDistortion,
    useResultAsSource
  };
});
