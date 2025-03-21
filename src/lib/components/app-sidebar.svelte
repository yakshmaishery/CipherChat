<script lang="ts">

   export let Window = ""
   export let IsConnected = false
   export let CameraOpen = false
   export let ScreenOpen = false
   import House from "@lucide/svelte/icons/house";
   import { MessageCircle,Video,ScreenShare,Contact,Landmark,UploadCloud } from "@lucide/svelte";
   import * as Sidebar from "$lib/components/ui/sidebar/index.js";3
   import DarkModeButton from '$lib/components/DarkModeButton.svelte';
   import '$lib/Styles/AppSliderCSS.css'
   import {AppName} from '$lib/UserStores'
   import { Slider } from "bits-ui";
   
   // Menu items.
   const items = [
    {
     title: "Home",
     icon: House,
    },
    {
     title: "Chat",
     icon: MessageCircle,
    },
    {
     title: "Video Chat",
     icon: Video,
    },
    {
     title: "Share Screen",
     icon: ScreenShare,
    },
    {
     title: "File Transfer",
     icon: UploadCloud,
    },
    {
     title: "Tutorials",
     icon: Landmark,
    },
    {
     title: "Contact",
     icon: Contact,
    }
   ];
  </script>
   
  <Sidebar.Root>
   <Sidebar.Content>
    <Sidebar.Group>
     <Sidebar.GroupLabel class="SliderHeader">
        {$AppName} <DarkModeButton/>
   </Sidebar.GroupLabel>
   <br/>
     <Sidebar.GroupContent>
      <Sidebar.Menu>
       {#each items as item (item.title)}
        <Sidebar.MenuItem>
         <Sidebar.MenuButton>
          {#snippet child({ props })}
           <a style={Window == item.title?"background: #ff8a00;cursor: pointer;":"cursor: pointer;"} {...props} on:click={()=>{
               if(IsConnected){
                  Window = item.title
               }
            }}>
            <item.icon />
            <span>{item.title}</span>
           </a>
          {/snippet}
         </Sidebar.MenuButton>
        </Sidebar.MenuItem>
       {/each}
      </Sidebar.Menu>
     </Sidebar.GroupContent>
    </Sidebar.Group>
    <Sidebar.GroupContent>
      <ul class="my-6 ml-6 list-disc [&>li]:mt-2">
         {#if ScreenOpen}
            <li>Your Screen is Shared</li>
         {/if}
         {#if CameraOpen}
            <li>Your Camera is Open</li>
         {/if}
      </ul>
    </Sidebar.GroupContent>
   </Sidebar.Content>
  </Sidebar.Root>