export const PET_WIDTH = 64
export const MOVEMENT_SPEED = 2

export enum PetState {
  WALKING = 'walking',
  PRINTING = 'printing',
  STOPPED = 'stopped'
}

export enum Direction {
  LEFT = -1,
  RIGHT = 1
}

// Dimensions of the pet in pixels (converted from tailwind w-16 h-16)
export const PET_DIMENSIONS = {
  width: 64,
  height: 64
}
