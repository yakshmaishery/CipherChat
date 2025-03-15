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
   import VideoShare from "$lib/Appwindows/VideoShare.svelte";
   import ShareCamera from "$lib/Appwindows/ShareCamera.svelte";
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
   let VulnerableMessages = ["jhzxkdvbuyizxv","CHATLEAVECODE","SharedScreenzjhgdvzjvguyzgv","StopScreenzjhgdvzjvguyzgv","SharedCamerazjhgdvzjvguyzgv","StopCamerazjhgdvzjvguyzgv"]
   let CameraOpen = false
   let CameraStream:any = null
   let cameraSide:string = "user"
   let videodata:HTMLVideoElement
   let videodataCamera:HTMLVideoElement
   let anotheruserscreen = ""
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
				Window = "Share Screen"
            anotheruserscreen = "Share Screen"
				// NavchildRef.closedrawer();
			}
			else if(data == "SharedCamerazjhgdvzjvguyzgv"){
				Window = "Video Chat"
            anotheruserscreen = "Video Chat"
            // videodataCamera.srcObject=null
            // try{
            //    document.exitFullscreen()
            // }
            // catch{}
				// NavchildRef.closedrawer();
			}
			else if(data == "StopScreenzjhgdvzjvguyzgv"){
				// NavchildRef.closedrawer();
            anotheruserscreen = ""
            videodata.srcObject=null
            try{
               document.exitFullscreen()
            }
            catch{}
			}
			else if(data == "StopCamerazjhgdvzjvguyzgv"){
				// NavchildRef.closedrawer();
            anotheruserscreen = ""
            videodataCamera.srcObject=null
            try{
               document.exitFullscreen()
            }
            catch{}
			}
			else{
            if(Window != "Chat"){
               Swal.fire({icon:"info",title:"You got a message!",text:"Go to Chat",confirmButtonColor: "green"})
            }
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

   // Start Share Screen
   async function ShareScreen() {
      let screenStream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video:{
             width:{ideal:4096},
             height:{ideal:2160}
      }
      }).catch((e) => {
             if(e.name == "NotAllowedError"){
                    Swal.fire({icon:"warning",title:"Recording was cancelled",confirmButtonColor: "green"})
             }
             else{
                    Swal.fire({icon:"error",title:"Something went wrong!",confirmButtonColor: "green"})
             }
      })
      if(screenStream){
         // @ts-ignore
         peer.call(AnotherID,screenStream)
         conn.send("SharedScreenzjhgdvzjvguyzgv")
         if(videodata){
            videodata.srcObject = screenStream
            videodata.play()
         }
         const mediarecorder = new MediaRecorder(screenStream)
         mediarecorder.start()
         mediarecorder.addEventListener("stop",()=>{
            // LeaveConnection()
            conn.send("StopScreenzjhgdvzjvguyzgv")
         })
      }
   }

   // Fetch the Stream of video
   peer.on('call', function(call) {
      call.answer()
      call.on("stream",function(remoteStream:any) {
         if(anotheruserscreen == "Share Screen"){
            videodata.srcObject = remoteStream
            videodata.play()
         }
         else{
            videodataCamera.srcObject = remoteStream
            videodataCamera.play()
         }
      })
   })
   
   // Start Share Screen
   async function CameraScreen() {
      const constraints = { video: { facingMode: cameraSide } }; // Use "environment" for back camera
      CameraStream = await navigator.mediaDevices.getUserMedia(constraints).catch((e) => {
             if(e.name == "NotAllowedError"){
                    Swal.fire({icon:"warning",title:"Recording was cancelled",confirmButtonColor: "green"})
             }
             else{
                    Swal.fire({icon:"error",title:"Something went wrong!",confirmButtonColor: "green"})
             }
      })
      if(CameraStream){
         CameraOpen = true
         // @ts-ignore
         peer.call(AnotherID,CameraStream)
         conn.send("SharedCamerazjhgdvzjvguyzgv")
         if(videodataCamera){
            videodataCamera.srcObject = CameraStream
            videodataCamera.play()
         }
         const mediarecorder = new MediaRecorder(CameraStream)
         mediarecorder.start()
         mediarecorder.addEventListener("stop",()=>{
            // LeaveConnection()
            conn.send("StopCamerazjhgdvzjvguyzgv")
         })
      }
   }

   function StopCamera(){
      CameraOpen = false
      if (CameraStream) {
         CameraStream.getTracks().forEach((track:any) => track.stop()); // Stop all tracks
      }
   }
</script>
<ModeWatcher />
<Sidebar.Provider>
	<AppSidebar bind:Window bind:IsConnected/>
   <main style="width: 100%;">
      <Sidebar.Trigger />
      <div style={`content-visibility:${Window=="Home"?"auto":"hidden"}`}>
         <Home bind:UserID bind:AnotherID on:ConnectwithUserFirst={ConnectwithUserFirst} bind:IsConnected on:LeaveConnection={LeaveConnection}/>
      </div>
      <div style={`content-visibility:${Window=="Chat"?"auto":"hidden"}`}>
         <Chat bind:UserMessage bind:LogMessages on:SendMessage={SendMessage} bind:IsConnected/>
      </div>
      <div style={`content-visibility:${Window=="Contact"?"auto":"hidden"}`}>
         <Contact/>
      </div>
      <div style={`content-visibility:${Window=="Share Screen"?"auto":"hidden"}`}>
         <VideoShare on:ShareScreen={ShareScreen} bind:videodata={videodata} bind:IsConnected/>
      </div>
      <div style={`content-visibility:${Window=="Video Chat"?"auto":"hidden"}`}>
         <ShareCamera on:CameraScreen={CameraScreen} bind:videodata={videodataCamera} 
         bind:IsConnected on:StopCamera={StopCamera} bind:cameraSide={cameraSide}/>
      </div>
    </main>
</Sidebar.Provider>