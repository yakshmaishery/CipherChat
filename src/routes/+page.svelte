<svelte:head>
   <title>Home</title>
</svelte:head>

<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
   import * as Table from "$lib/components/ui/table/index.js";
   import { Progress } from "$lib/components/ui/progress/index.js";
   import { Download } from "@lucide/svelte";
   import AppSidebar from "$lib/components/app-sidebar.svelte";
   import Contact from "$lib/Appwindows/Contact.svelte";
   import Home from "$lib/Appwindows/Home.svelte";
   import Chat from "$lib/Appwindows/Chat.svelte";
   import VideoShare from "$lib/Appwindows/VideoShare.svelte";
   import ShareCamera from "$lib/Appwindows/ShareCamera.svelte";
   import Tutorial from "$lib/Appwindows/Tutorial.svelte";
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
   let ScreenOpen = false
   let CameraStream:any = null
   let cameraSide:string = "user"
   let videodata:HTMLVideoElement
   let videodataCamera:HTMLVideoElement
   let anotheruserscreen = ""
   const CHUNK_SIZE = 64 * 1024; // 64KB chunks
   const receivedBuffers:any = {};
   const fileInfo:any = {};
   let Progressvalue = 0;
   let Progressmax = 0;
   let downloadfileList:{filename:string,base64:string}[] = []
   const shortdummyID = nanoid(4).toLowerCase() // Generate Random User ID
   var peer = new Peer(shortdummyID) // Create Peer

   peer.on("open",(id) => { // Connect Peer if Success set the ID
      UserID = id
   })

	peer.on('error', (err) => { // IF Peer connection fails
      if(err.type == "invalid-id"){
         location.reload()
      }
      else{
         Swal.fire({icon:"error",title:"PEER CONNECTION:- "+err.type,confirmButtonColor: "green"})
      }
   });

   // Connect with another person
   function ConnectwithUserFirst(){
      debugger
      AnotherID = AnotherID.toLowerCase()
      conn = peer.connect(AnotherID)
      conn.on("open",function(){
         conn.send("jhzxkdvbuyizxv")
         IsConnected = true
         Swal.fire({icon:"success",title:"Connected successfully",confirmButtonColor: "green",timer:1500,showConfirmButton:false})
      })
      conn.on('error', (err:any) => {
         Swal.fire({icon:"error",title:err.type,confirmButtonColor: "green"})
      });
   }

   peer.on('connection', function(inconn) {
      inconn.on('data', function(data:any){
         if(typeof data == "string"){
            if(data == "jhzxkdvbuyizxv"){
               console.warn(inconn.peer)
               AnotherID = inconn.peer
               conn = peer.connect(AnotherID)
               conn.on("open",function(){
                  IsConnected = true
                  Swal.fire({icon:"success",title:`Connection has been established with ${AnotherID}`,confirmButtonColor: "green",timer:1500,showConfirmButton:false})
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
                  Swal.fire({icon:"info",title:"You got a message!",text:"Go to Chat",confirmButtonColor: "green",timer:1500,showConfirmButton:false})
               }
               LogMessages.push({type:"Receiver",message:data,timestamp:new Date()})
               LogMessages = LogMessages
               scrolldownmessages()
            }
         }
         else{
            if (data.type === 'start') {
               fileInfo[data.name] = { size: data.size, received: 0 };
               receivedBuffers[data.name] = [];
               Progressvalue=0
            } else if (data.type === 'chunk') {
               receivedBuffers[data.name].push(data.data);
               fileInfo[data.name].received += data.data.byteLength;
               Progressvalue=fileInfo[data.name].received
               Progressmax = fileInfo[data.name].size
               // console.log(`Received ${fileInfo[data.name].received} of ${fileInfo[data.name].size}`);
            } else if (data.type === 'end') {
               const received = new Blob(receivedBuffers[data.name]);
               // const a = document.createElement('a');
               // a.href = URL.createObjectURL(received);
               // a.download = data.name;
               // a.click();
               downloadfileList.push({filename:data.name,base64:URL.createObjectURL(received)})
               downloadfileList = downloadfileList
               Progressmax = 0
               Progressvalue = 0
               delete receivedBuffers[data.name];
               delete fileInfo[data.name];
               if(Window!="File Transfer"){
                  Swal.fire({icon:"success",title:"You have received an file go to File Transfer!",confirmButtonColor: "green",showConfirmButton:false,timer:1500})
               }
               // console.log('Download ready');
            }
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
         Swal.fire({icon:"warning",title:"Message cannot be empty!",confirmButtonColor: "green"})
      }
      else{
         Swal.fire({icon:"error",title:"User Data contains vulnerable Information",confirmButtonColor: "green"})
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
      try{
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
            ScreenOpen =true
            const mediarecorder = new MediaRecorder(screenStream)
            mediarecorder.start()
            mediarecorder.addEventListener("stop",()=>{
               // LeaveConnection()
               conn.send("StopScreenzjhgdvzjvguyzgv")
               ScreenOpen = false
            })
         }
      }
      catch{
         Swal.fire({icon:"error",title:"Something went wrong!",confirmButtonColor: "green"})
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
      try{
         const constraints = { video: { facingMode: cameraSide } ,Audio:true}; // Use "environment" for back camera
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
            const mediarecorder = new MediaRecorder(CameraStream)
            mediarecorder.start()
            mediarecorder.addEventListener("stop",()=>{
               // LeaveConnection()
               conn.send("StopCamerazjhgdvzjvguyzgv")
            })
         }
      }
      catch{
         Swal.fire({icon:"error",title:"Something went wrong!",confirmButtonColor: "green"})
      }
   }

   function StopCamera(){
      CameraOpen = false
      if (CameraStream) {
         CameraStream.getTracks().forEach((track:any) => track.stop()); // Stop all tracks
      }
   }

   function sendFile(file:any) {
  const fileReader = new FileReader();
  let offset = 0;

  fileReader.onload = (e:any) => {
      conn.send({
         type: 'chunk',
         name: file.name,
         size: file.size,
         data: e.target.result,
         offset
      });
      offset += e.target.result.byteLength;
      Progressvalue=offset
      Progressmax = file.size
      if (offset < file.size) {
         readSlice(offset);
      } else {
         Progressmax = 0
         Progressvalue = 0
         conn.send({ type: 'end', name: file.name });
         Swal.fire({icon:"success",title:"File transfer complete",confirmButtonColor: "green"})
         // console.log('File transfer complete');
      }
   };

      function readSlice(o:any) {
         const slice = file.slice(o, o + CHUNK_SIZE);
         fileReader.readAsArrayBuffer(slice);
      }

      conn.send({ type: 'start', name: file.name, size: file.size });
      readSlice(0);
   }

   const filechange = async (e:any) =>{
      console.warn(e.target.files)
      if(e){
         if(e.target){
            if(e.target.files){
               if(e.target.files.length>0){
                  sendFile(e.target.files[0])
                  try {
                  let base64String:any = await fileToBase64(e.target.files[0]);
                  downloadfileList.push({filename:e.target.files[0].name,base64:base64String})
                  downloadfileList = downloadfileList
               } catch (err) {
                  console.error('Error converting file:', err);
               }
               }
            }
         }
      }
   }

   const downloadfile = (filename:string,base64:string) =>{
      const a = document.createElement('a');
      a.href = base64;
      a.download = filename;
      a.click();
   }

   function fileToBase64(file:any) {
      return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.readAsDataURL(file);  // This will give you a base64 encoded string
         reader.onload = () => resolve(reader.result);
         reader.onerror = error => reject(error);
      });
   }

</script>
<ModeWatcher />
<Sidebar.Provider>
	<AppSidebar bind:Window bind:IsConnected bind:CameraOpen bind:ScreenOpen/>
   <main style="width: 100%;">
      <Sidebar.Trigger />
      <!-- Home Window -->
      <div style={`content-visibility:${Window=="Home"?"auto":"hidden"}`}>
         <Home bind:UserID bind:AnotherID on:ConnectwithUserFirst={ConnectwithUserFirst} bind:IsConnected on:LeaveConnection={LeaveConnection}/>
      </div>
      <!-- Chat Window -->
      <div style={`content-visibility:${Window=="Chat"?"auto":"hidden"}`}>
         <Chat bind:UserMessage bind:LogMessages on:SendMessage={SendMessage} bind:IsConnected/>
      </div>
      <!-- Contact Window -->
      <div style={`content-visibility:${Window=="Contact"?"auto":"hidden"}`}>
         <Contact/>
      </div>
      <!-- Share Screen Window -->
      <div style={`content-visibility:${Window=="Share Screen"?"auto":"hidden"}`}>
         <VideoShare on:ShareScreen={ShareScreen} bind:videodata={videodata} bind:IsConnected bind:ScreenOpen/>
      </div>
      <!-- Video Chat Window -->
      <div style={`content-visibility:${Window=="Video Chat"?"auto":"hidden"}`}>
         <ShareCamera on:CameraScreen={CameraScreen} bind:videodata={videodataCamera} 
         bind:IsConnected on:StopCamera={StopCamera} bind:cameraSide={cameraSide} bind:CameraOpen/>
      </div>
      <!-- File Transfer Window -->
      <div style={`content-visibility:${Window=="File Transfer"?"auto":"hidden"}`}>
         <div class="px-10 py-3">
            <input type="file" class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" on:change={(e)=>{filechange(e)}} />
         </div>
         {#if Progressmax != 0}
            <Progress value={Progressvalue} max={Progressmax} class="w-[95%] mx-3" />
         {/if}
         <div class="px-10">
            <Table.Root>
               <Table.Caption></Table.Caption>
               <Table.Header>
                 <Table.Row>
                   <Table.Head class="w-[100px]">File name</Table.Head>
                   <Table.Head class="text-right">download</Table.Head>
                 </Table.Row>
               </Table.Header>
               <Table.Body>
                 <!-- <Table.Row>
                   <Table.Cell class="font-medium">ABC.pdf</Table.Cell>
                   <Table.Cell class="text-right">
                     <button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" 
                     disabled={!IsConnected}><Download/></button>
                   </Table.Cell>
                 </Table.Row> -->
                 {#each downloadfileList as item}
                  <Table.Row>
                     <Table.Cell class="font-medium">{item.filename}</Table.Cell>
                     <Table.Cell class="text-right">
                     <button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md" 
                     disabled={!IsConnected} on:click={()=>{downloadfile(item.filename,item.base64)}}><Download/></button>
                     </Table.Cell>
                  </Table.Row>
                 {/each}
               </Table.Body>
             </Table.Root>
         </div>
      </div>
      <!-- Tutorials Window -->
      <div style={`content-visibility:${Window=="Tutorials"?"auto":"hidden"}`}>
         <Tutorial/>
      </div>
    </main>
</Sidebar.Provider>