import { writable } from 'svelte/store';

export const AppName = writable("Cipher Chat");
export const IsConnected = writable(false)
export const UserID = writable("")
export const AnotherID = writable("")
export const UserMessage = writable("")