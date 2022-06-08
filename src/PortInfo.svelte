<script>
    export let port = {
        info: { label: "8080" },
        status: { localPort: 8080, remotePort: 8081 },
    };

    $: showRemoteDetail =
        port.status.remotePort &&
        port.status.remotePort !== port.status.localPort;

    $: showPortDetail =
        port.info.label !== port.status.localPort.toString() ||
        showRemoteDetail;
</script>

<main>
    <span>{port.info.label}</span>
    {#if showPortDetail}
        {#if showRemoteDetail}
            <span>({port.status.localPort}:{port.status.remotePort})</span>
        {:else}
            <span>({port.status.localPort})</span>
        {/if}
    {/if}
</main>
