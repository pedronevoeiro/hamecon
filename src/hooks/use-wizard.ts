"use client";

import { useReducer, useCallback } from "react";

export interface WizardState {
  step: number;
  shapeId: string | null;
  shapeSlug: string | null;
  shapeName: string | null;
  aspectRatio: string | null;
  sizeId: string | null;
  sizeLabel: string | null;
  priceInCents: number | null;
  imageFile: File | null;
  croppedImageUrl: string | null;
  croppedBlob: Blob | null;
}

type Action =
  | { type: "SET_SHAPE"; shapeId: string; shapeSlug: string; shapeName: string; aspectRatio: string }
  | { type: "SET_SIZE"; sizeId: string; sizeLabel: string; priceInCents: number }
  | { type: "SET_IMAGE"; imageFile: File }
  | { type: "SET_CROPPED"; croppedImageUrl: string; croppedBlob: Blob }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; step: number };

const initialState: WizardState = {
  step: 0,
  shapeId: null,
  shapeSlug: null,
  shapeName: null,
  aspectRatio: null,
  sizeId: null,
  sizeLabel: null,
  priceInCents: null,
  imageFile: null,
  croppedImageUrl: null,
  croppedBlob: null,
};

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case "SET_SHAPE":
      return {
        ...state,
        shapeId: action.shapeId,
        shapeSlug: action.shapeSlug,
        shapeName: action.shapeName,
        aspectRatio: action.aspectRatio,
        sizeId: null,
        sizeLabel: null,
        priceInCents: null,
      };
    case "SET_SIZE":
      return {
        ...state,
        sizeId: action.sizeId,
        sizeLabel: action.sizeLabel,
        priceInCents: action.priceInCents,
      };
    case "SET_IMAGE":
      return { ...state, imageFile: action.imageFile };
    case "SET_CROPPED":
      return {
        ...state,
        croppedImageUrl: action.croppedImageUrl,
        croppedBlob: action.croppedBlob,
      };
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, 4) };
    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 0) };
    case "GO_TO_STEP":
      return { ...state, step: action.step };
    default:
      return state;
  }
}

export function useWizard() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setShape = useCallback(
    (shapeId: string, shapeSlug: string, shapeName: string, aspectRatio: string) => {
      dispatch({ type: "SET_SHAPE", shapeId, shapeSlug, shapeName, aspectRatio });
    },
    []
  );

  const setSize = useCallback(
    (sizeId: string, sizeLabel: string, priceInCents: number) => {
      dispatch({ type: "SET_SIZE", sizeId, sizeLabel, priceInCents });
    },
    []
  );

  const setImage = useCallback((imageFile: File) => {
    dispatch({ type: "SET_IMAGE", imageFile });
  }, []);

  const setCropped = useCallback((croppedImageUrl: string, croppedBlob: Blob) => {
    dispatch({ type: "SET_CROPPED", croppedImageUrl, croppedBlob });
  }, []);

  const nextStep = useCallback(() => dispatch({ type: "NEXT_STEP" }), []);
  const prevStep = useCallback(() => dispatch({ type: "PREV_STEP" }), []);
  const goToStep = useCallback(
    (step: number) => dispatch({ type: "GO_TO_STEP", step }),
    []
  );

  return {
    state,
    setShape,
    setSize,
    setImage,
    setCropped,
    nextStep,
    prevStep,
    goToStep,
  };
}
