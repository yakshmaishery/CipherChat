<script lang="ts">
   export let IsConnected = false
   export let cameraSide = ""
   export let videodata:HTMLVideoElement
   import "$lib/Styles/VideoShareCSS.css"
   import { Switch } from "$lib/components/ui/switch/index.js";
   import { createEventDispatcher,onMount } from 'svelte';
   const dispatch = createEventDispatcher();
   // Full screen video
	function fullscreenbtn() {
		if(videodata){
			videodata.requestFullscreen()
		}
	}
   function CheckCameraSide(e:any){
      console.warn(e)
   }
   onMount(()=>{
      document.getElementById("airplane-mode")?.addEventListener("click",(e)=>{
         if(cameraSide != "user"){
            cameraSide = "user"
         }
         else{
            cameraSide = "environment"
         }
      })
   })
</script>
<div class="dark:text-white">
   <div class="px-2 py-2">
      <div style="display: flex;gap:20px;overflow-y:auto">
         <div class="flex items-center space-x-2">
            <Switch id="airplane-mode" checked />
            <label for="airplane-mode">Front Camera</label>
         </div>
         <button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" 
         on:click={()=>{dispatch("CameraScreen")}} disabled={!IsConnected}>Start Camera</button>
         <button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" 
         on:click={()=>{dispatch("StopCamera")}} disabled={!IsConnected}>Stop Camera</button>
         <button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" 
         on:click={fullscreenbtn} disabled={!IsConnected}>Full Screen</button>
      </div>  
   </div>
   <div>
      <!-- svelte-ignore a11y_media_has_caption -->
      <!-- svelte-ignore element_invalid_self_closing_tag -->
      <video bind:this={videodata} controls id="videotag"/>
   </div>
</div>