<script lang="ts">

   export let Window = ""
   import House from "@lucide/svelte/icons/house";
   import { MessageCircle,Video,ScreenShare,Upload,Contact,Landmark } from "@lucide/svelte";
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
     title: "File Share",
     icon: Upload,
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
     <Sidebar.GroupContent>
      <Sidebar.Menu>
       {#each items as item (item.title)}
        <Sidebar.MenuItem>
         <Sidebar.MenuButton>
          {#snippet child({ props })}
           <a style="cursor: pointer;" {...props} on:click={()=>{Window = item.title}}>
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
   </Sidebar.Content>
  </Sidebar.Root>