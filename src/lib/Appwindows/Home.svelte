<script lang="ts">
   export let UserID = ""
   export let AnotherID = ""
   import { createEventDispatcher } from 'svelte';
   const dispatch = createEventDispatcher();
   export let IsConnected = false
   import Input from '$lib/components/ui/input/input.svelte'
</script>
<div class="container dark:text-white">
   <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      Welcome to Cipher Chat
    </h1>
    <h2
    class="mt-10 scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
    Share your ID - {UserID}
  </h2>
  <div class="mt-10" style="display: flex;">
   <Input bind:value={AnotherID}  disabled={IsConnected} style="text-transform: lowercase" placeholder="Search by another Id..."/>
      <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md" 
      on:click={()=>{dispatch("ConnectwithUserFirst")}} disabled={IsConnected}>Connect</button>
   </div>
   <div class="mt-3">
      <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md" 
      on:click={()=>{dispatch("LeaveConnection")}} disabled={!IsConnected}>Leave</button>
   </div>
</div>