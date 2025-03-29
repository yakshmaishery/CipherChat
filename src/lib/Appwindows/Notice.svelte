<script lang="ts">
   import Terminal from "@lucide/svelte/icons/terminal";
   import * as Alert from "$lib/components/ui/alert/index.js";
</script>
<div class="container" style="text-align:left">
   <Alert.Root>
    <!-- <Terminal class="size-4" /> -->
    <Alert.Title>Notice: No TURN Server Available</Alert.Title>
    <br/>
    <Alert.Description>Dear Users,<br/>
      Please be advised that there is currently no TURN server configured. As a result, PeerJS connections may not work across different networks (e.g., when users are behind NAT or firewalls).<br/>
      For successful peer-to-peer communication across networks, a TURN server is required to relay connections. Until a TURN server is set up, users on different networks may experience connection issues.<br/>
      Thank you for your understanding.</Alert.Description>
   </Alert.Root>
   <br/>
   <Alert.Root>
      <!-- <Terminal class="size-4" /> -->
      <Alert.Title>Notice: Screen Share Not Supported on Mobile</Alert.Title>
      <br/>
      <Alert.Description>Dear Users,<br/>
         Please be advised that the Screen Share functionality is currently not supported on mobile devices due to technical issues. Our team is actively working to resolve these errors, and we appreciate your patience.<br/>
         For the best experience, please use a desktop or laptop to access this feature.<br/>
         Thank you for your understanding.
      </Alert.Description>
   </Alert.Root>
</div>