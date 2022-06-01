<script>
    let time = new Date().toString();
    let headers = [
        { label: "Port", field: "port" },
        { label: "Local Address", field: "local_address" },
        { label: "Running Process", field: "running_process" },
        { label: "Visibility", field: "visibility" },
        { label: "Origin", field: "origin" },
    ];
    let ports = [
        {
            port: 3000,
            local_address: "https://github.com/mustard-mh/port-view-extension",
            running_process: "/usr/bin/node hello.js",
            visibility: "private",
            origin: "Auto Forwarded",
        },
        {
            port: 8080,
            local_address: "http://localhost:8080",
            running_process: "",
            visibility: "public",
            origin: "Auto Forwarded",
        },
    ];

    $: mappedPorts = ports.map((e) => {
        if (e.local_address?.length > 0) {
            e.local_address = `<a href="${e.local_address}">${e.local_address}</a>`;
        }
        return e;
    });

    window.addEventListener("message", (event) => {
        if (event.data.command === "changeName") {
            time = event.data.name;
        }
    });
</script>

<main>
    <table>
        <tr>
            {#each headers as header (header.label)}
                <th>{header.label}</th>
            {/each}
        </tr>
        {#each mappedPorts as port (port.port)}
            <tr class="tr-data">
                {#each headers as header (header.label)}
                    <td>{@html port[header.field]}</td>
                {/each}
            </tr>
        {/each}
    </table>
</main>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
    }
    td,
    th {
        text-align: left;
        padding-left: 8px;
        border: 0px inset gray;
        border-width: 0px 1px 0px 1px;
        border-collapse: collapse;
    }
    .tr-data:hover {
        background-color: aquamarine;
    }
</style>
