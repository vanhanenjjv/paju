import { writable } from "svelte/store";

export type Facing = 
  | 'environment' 
  | 'user'
  
export type VideoDevice = { id: string }

export type CameraOptions =
  { facing: Facing
    flipped: boolean
    device: VideoDevice | null }

export const options = writable<CameraOptions>({
  facing: 'user',
  flipped: true,
  device: null
})
