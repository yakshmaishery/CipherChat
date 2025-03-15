<svelte:head>
   <title>Home</title>
</svelte:head>

<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
   import AppSidebar from "$lib/components/app-sidebar.svelte";
   import Contact from "$lib/Appwindows/Contact.svelte";
   import Home from "$lib/Appwindows/Home.svelte";
   import Chat from "$lib/Appwindows/Chat.svelte";
   import {Peer} from 'peerjs'
   import {nanoid} from 'nanoid'
   import Swal from 'sweetalert2';

   let Window = "Home"
   let IsConnected:boolean = false
	let UserID = ""
	let AnotherID = ""
	let UserMessage = ""
	let conn:any
	let LogMessages:{type:string;message:string;timestamp:Date}[] = []
   let VulnerableMessages = ["jhzxkdvbuyizxv","CHATLEAVECODE","SharedScreenzjhgdvzjvguyzgv","StopScreenzjhgdvzjvguyzgv"]
   let cameraSide:string = "user"
   const shortdummyID = nanoid(4).toLowerCase() // Generate Random User ID
   var peer = new Peer(shortdummyID,{config: {iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]}}) // Create Peer

   peer.on("open",(id) => { // Connect Peer if Success set the ID
      UserID = id
   })

	peer.on('error', (err) => { // IF Peer connection fails
      Swal.fire({icon:"error",title:"PEER CONNECTION:- "+err.type,confirmButtonColor: "green"})
   });

   // Connect with another person
   function ConnectwithUserFirst(){
      debugger
      conn = peer.connect(AnotherID)
      conn.on("open",function(){
         conn.send("jhzxkdvbuyizxv")
         IsConnected = true
         Swal.fire({icon:"success",title:"Connected successfully",confirmButtonColor: "green"})
      })
      conn.on('error', (err:any) => {
         Swal.fire({icon:"error",title:err.type,confirmButtonColor: "green"})
      });
   }

   peer.on('connection', function(inconn) {
      inconn.on('data', function(data:any){
			if(data == "jhzxkdvbuyizxv"){
				console.warn(inconn.peer)
            AnotherID = inconn.peer
            conn = peer.connect(AnotherID)
            conn.on("open",function(){
               IsConnected = true
               Swal.fire({icon:"success",title:`Connection has been established with ${AnotherID}`,confirmButtonColor: "green"})
            })
			}
			else if(data == "CHATLEAVECODE"){
            // If leave
            conn.close()
            location.reload()
         }
			else if(data == "SharedScreenzjhgdvzjvguyzgv"){
				Window = "ShareScreen"
				// NavchildRef.closedrawer();
			}
			else if(data == "StopScreenzjhgdvzjvguyzgv"){
				// NavchildRef.closedrawer();
            // videodata.srcObject=null
            try{
               document.exitFullscreen()
            }
            catch{}
			}
			else{
				LogMessages.push({type:"Receiver",message:data,timestamp:new Date()})
				LogMessages = LogMessages
            scrolldownmessages()
			}
		})
	})

   // Send Messages
	const SendMessage = () => {
      if(!VulnerableMessages.includes(UserMessage) && UserMessage!=""){
         conn.send(UserMessage)  
         LogMessages.push({type:"Sender",message:UserMessage,timestamp:new Date()})
         UserMessage = ""
         LogMessages = LogMessages
         scrolldownmessages()
      }
      else if(UserMessage==""){
         // const t: ToastSettings = {
			// 	message: 'Please enter message!',
			// };
			// toastStore.trigger(t);
      }
      else{
         // const t: ToastSettings = {
			// 	message: 'User Data contains vulnerable Information',
			// };
			// toastStore.trigger(t);
      }
   }

   // Leave Connection
	const LeaveConnection = () => {
      conn.send("CHATLEAVECODE")
      conn.close()
      location.reload()
   }
   // Auto Scroll down
	const scrolldownmessages = () => {
      setTimeout(() => {
         const div = document.getElementById("chatwindow");
         if(div){
            div.scrollTo({
               top: div.scrollHeight+2000,
               behavior: "smooth"
            });
         }
      }, 500);
   }
</script>
<ModeWatcher />
<Sidebar.Provider>
	<AppSidebar bind:Window/>
   <main style="width: 100%;">
      <Sidebar.Trigger />
      {#if Window == "Home"}
         <Home bind:UserID bind:AnotherID on:ConnectwithUserFirst={ConnectwithUserFirst} bind:IsConnected on:LeaveConnection={LeaveConnection}/>
      {/if}
      {#if Window == "Chat"}
         <Chat bind:UserMessage bind:LogMessages on:SendMessage={SendMessage} bind:IsConnected/>
      {/if}
      {#if Window == "Contact"}
         <Contact/>
      {/if}
    </main>
</Sidebar.Provider>