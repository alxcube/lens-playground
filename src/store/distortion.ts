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
import { ref, shallowRef, watchEffect } from 'vue';

export interface DistortionArgumentsValidationErrors {
  image?: string[];
  distortionName?: string[];
  args?: string[];
  invalidArgs?: number[];
  imageViewportOffset?: string[];
  filter?: string[];
  viewport?: string[];
}

export const useDistortionStore = defineStore('distortion', () => {
  // Input image and viewport
  const sourceImage = shallowRef<HTMLCanvasElement>();
  const sourceImageViewport = ref<{ x1: number; y1: number; x2: number; y2: number }>();

  // Distortion name and arguments
  const distortionName = ref<keyof ReversePixelMapperFactoriesPoolKeyMap | string>('Affine');
  const distortionArguments = ref<number[]>([]);

  // distort() options
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

  // Processing states
  const isLoadingSourceImage = ref(false);
  const isProcessingDistortion = ref(false);

  // Distortion results
  const distortedImage = shallowRef<HTMLCanvasElement>();
  const distortionViewport = ref<{ x1: number; y1: number; x2: number; y2: number }>();
  const distortionDuration = ref<number>();
  const distortionError = ref<Error | string>();

  // Input validation errors
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

  const validateArguments = (noThrow = false) => {
    validationErrors.value = {};
    let hasErrors = false;

    const imageErrors = getSourceImageValidationErrors(sourceImage.value);
    if (imageErrors.length) {
      hasErrors = true;
      validationErrors.value.image = imageErrors;
    }

    if (!distortionName.value) {
      hasErrors = true;
      validationErrors.value.distortionName = ['Distortion name is not set.'];
    } else {
      const [messages, invalidIndexes] = validateDistortionArguments(
        distortionName.value,
        distortionArguments.value
      );
      if (messages.length || invalidIndexes.length) {
        hasErrors = true;
        validationErrors.value.args = messages;
        validationErrors.value.invalidArgs = invalidIndexes;
      }
    }

    if (imageViewportOffsetOption.value !== undefined) {
      if (
        typeof imageViewportOffsetOption.value[0] !== 'number' ||
        typeof imageViewportOffsetOption.value[1] !== 'number'
      ) {
        validationErrors.value.imageViewportOffset = ['X and Y both must be numbers.'];
      }
    }

    if (filterOption.value !== undefined) {
      const errors = validateFilterOption(filterOption.value);
      if (errors.length) {
        hasErrors = true;
        validationErrors.value.filter = errors;
      }
    }

    if (viewportOption.value !== undefined) {
      const errors = validateViewport(viewportOption.value);
      if (errors.length) {
        hasErrors = true;
        validationErrors.value.viewport = errors;
      }
    }

    if (hasErrors && !noThrow) {
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

  watchEffect(() => {
    validateArguments(true);
  });

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

function getSourceImageValidationErrors(image: HTMLCanvasElement | undefined): string[] {
  const errors: string[] = [];
  if (!image) {
    errors.push('Source image is not set');
  }
  return errors;
}

function validateDistortionArguments(
  distortion: keyof ReversePixelMapperFactoriesPoolKeyMap | string,
  args: unknown[]
): [string[], number[]] {
  const messages: string[] = [];
  const invalidIndexes: number[] = [];
  let checkLimit = args.length;

  if (distortion === 'Affine') {
    if (args.length < 4) {
      messages.push('Affine distortion requires at least 4 arguments');
    }
    if (args.length % 4) {
      messages.push('Affine distortion arguments count must be multiple of 4.');
    }
    checkLimit = Math.floor(args.length / 4) + (args.length % 4) ? 4 : 0;
  }
  if (distortion === 'AffineProjection') {
    if (args.length !== '6') {
      messages.push('AffineProjection distortion requires exactly 6 arguments.');
      checkLimit = 6;
    }
  }
  if (distortion === 'Perspective') {
    if (args < 16) {
      messages.push('Perspective distortion requires at least 16 arguments.');
    }
    if (args.length % 4) {
      messages.push('Perspective distortion arguments count must be multiple of 4.');
    }
    checkLimit = Math.max(16, Math.floor(args.length / 4) + (args.length % 4) ? 4 : 0);
  }
  if (distortion === 'PerspectiveProjection') {
    if (args.length !== 8) {
      messages.push('PerspectiveProjection distortion requires exactly 8 arguments.');
    }
    checkLimit = 8;
  }
  if (distortion === 'Arc') {
    checkLimit = 1;
    if (typeof args[0] !== 'number' || args[0] < 0) {
      messages.push('Arc angle must be positive number.');
      invalidIndexes.push(0);
    }
    if (typeof args[1] !== 'undefined') {
      checkLimit = 2;
    }
    if (typeof args[2] !== 'undefined') {
      checkLimit = 3;
      if (typeof args[2] === 'number' && args[2] < 0) {
        messages.push('Arc outer radius must be positive number.');
      }
    }
    if (typeof args[3] !== 'undefined') {
      checkLimit = 4;
      if (typeof args[3] === 'number') {
        if (typeof args[2] !== 'number') {
          messages.push('Outer radius must be specified to use inner radius.');
          invalidIndexes.push(2);
        } else if (args[3] >= args[2]) {
          messages.push('Arc outer radius must be greater than inner radius.');
          invalidIndexes.push(2, 3);
        }
        if (args[3] < 0) {
          messages.push('Arc inner radius must be greater of equal 0.');
          invalidIndexes.push(3);
        }
      }
    }
  }

  for (let i = 0; i < checkLimit; i++) {
    if (typeof args[i] !== 'number' || Number.isNaN(args[i])) {
      invalidIndexes.push(i);
    }
  }

  return [
    messages,
    invalidIndexes.reduce((result, current) => {
      if (!result.includes(current)) {
        result.push(current);
      }
      return result;
    }, [] as number[])
  ];
}

function validateFilterOption(filterPreset: ResampleFilterPreset): string[] {
  const errors: string[] = [];
  if (filterPreset.filterFunctionFactoryArgs.some((arg) => (typeof arg as unknown) !== 'number')) {
    errors.push('All filter function factory arguments must be numbers.');
  }
  if (filterPreset.windowFunctionFactoryArgs.some((arg) => (typeof arg as unknown) !== 'number')) {
    errors.push('All window function factory arguments must be numbers');
  }
  if (
    (filterPreset.filterFunctionFactory === 'CubicBC' &&
      filterPreset.filterFunctionFactoryArgs.length < 2) ||
    (filterPreset.windowFunctionFactory === 'CubicBC' &&
      filterPreset.windowFunctionFactoryArgs.length < 2)
  ) {
    errors.push('CubicBC expects exactly 2 arguments.');
  }
  if ((typeof filterPreset.support as unknown) !== 'number') {
    errors.push('Filter support must be number.');
  }
  if ((typeof filterPreset.scale as unknown) !== 'number') {
    errors.push('Filter scale must be number.');
  }
  return errors;
}

function validateViewport(
  vp: 'bestFit' | { x1: number; y1: number; x2: number; y2: number }
): string[] {
  const errors: string[] = [];
  if (typeof vp === 'string') {
    return errors;
  }
  const { x1, y1, x2, y2 } = vp;
  if (x2 < x1) {
    errors.push("Viewport 'x2' prop should be greater than 'x1'.");
  }
  if (y2 < y1) {
    errors.push("Viewport 'y2' prop should be greater than 'y1'.");
  }
  return errors;
}
