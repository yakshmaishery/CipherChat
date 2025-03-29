<script lang="ts">
   import * as Accordion from "$lib/components/ui/accordion/index.js";
   import '$lib/Styles/TutorialsCSS.css'
   let AccoridianLists = [
      {title:"Chat",content:"chat without the need for a server to relay messages. Instead, users connect directly with each other, resulting in low latency and efficient data transfer.,No server bottlenecks mean faster communication.",
         steps:[
            "Go to Chat",
            "Enter your message!",
            "Click Send"
         ]
      },
      {title:"Video Chat",content:"Video chat allowing users to stream video and audio directly between browsers without routing through a server.",
         steps:[
            "Go to Video Chat",
            "set the camera side default is front.",
            "Click on start camera, you will get an alert if successfull and another person will be able to communicate through your camera.",
            "Another person can click on full screen to view the window at full screen",
         ]
      },
      {title:"Share Screen",content:"Share screen enabling one user to share their screen directly with another without the need for server-based relaying.",
         steps:[
            "Go to Share Screen",
            "Click on share screen button chose the window entire screen is recommended.",
         ]
      },
      {title:"File Transfer",content:"one of our powerful capabilities is direct file transfer between two users without the need for intermediate servers. No file uploads to external servers,Low latency and secure, as data goes directly between users.",
         steps:[
            "Go to File Transfer",
            "Click on Choose file button select file and immediately file will be transfered to another person."
         ]
      },
   ]
</script>
<div class="container">
   <h2 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      Tutorial Steps
    </h2>
      <Accordion.Root type="single" class="w-full sm:max-w-[100%]">
         {#each AccoridianLists as item}   
            <Accordion.Item value={item.title}>
            <Accordion.Trigger>{item.title}</Accordion.Trigger>
            <Accordion.Content>
               {item.content}
               {#if item.steps}
                  <ol type="1" class="Listtag">
                     {#each item.steps as con}
                           <li>{con}</li>
                     {/each}
                  </ol>
               {/if}
            </Accordion.Content>
            </Accordion.Item>
         {/each}
      </Accordion.Root>
   <br/>
   <br/>
   <br/>
   <!-- <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      Notice
   </h1>
   <div>
      <blockquote class="mt-6 border-l-2 pl-6 italic">
         Screen share is currently not supported for mobile
      </blockquote>
   </div> -->
</div>