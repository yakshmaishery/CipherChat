<script lang="ts">
   export let UserMessage = ""
   export let IsConnected = false
   export let LogMessages:{type:string;message:string;timestamp:Date}[] = []
   import { Button } from "$lib/components/ui/button/index"
   import { Textarea } from "$lib/components/ui/textarea/index.js";
   import "$lib/Styles/ChatWindowCSS.css"
   import { createEventDispatcher } from 'svelte';
   const dispatch = createEventDispatcher();
</script>
<div class="dark:text-white ChatWindow">
   <div class="chatbubblewindow" id="chatwindow">
      <div class="chat-container">
         {#each LogMessages as item}   
            {#if item.type != "Sender"}
               <pre class="chat-bubble chat-left">{item.message}</pre>
               {:else}
               <pre class="chat-bubble chat-right">{item.message}</pre>
            {/if}
         {/each}
      </div>
   </div>
   <div class="Textdiv">
      <Textarea style="min-height:auto" rows={1} bind:value={UserMessage} disabled={!IsConnected} />
      <button class="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md" 
      on:click={()=>{dispatch("SendMessage")}} disabled={!IsConnected}>Send</button>
   </div>
</div>