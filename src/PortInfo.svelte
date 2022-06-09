<script>
    export let port = {
        info: { label: "8080" },
        status: { localPort: 8080, remotePort: 8081 },
    };

    let info = "";
    $: ((port) => {
        const showRemoteDetail =
            port.status.remotePort &&
            port.status.remotePort !== port.status.localPort;
        const showPortDetail =
            port.info.label !== port.status.localPort.toString() ||
            showRemoteDetail;

        info = port.info.label;
        if (showPortDetail) {
            if (showRemoteDetail) {
                info += ` (${port.status.localPort}:${port.status.remotePort})`
            } else {
                info += port.status.localPort
            }
        }
    })(port);
</script>

<main>
    <span title={info}>{info}</span>
</main>

<style>
    span {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
