<script>
    import ContextMenu from "./ContextMenu.svelte";
    import Resizable from "./Resizable.svelte";
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
            e._local_address = e.local_address;
            e.local_address = `<a href="${e.local_address}">${e.local_address}</a>`;
        }
        return e;
    });

    window.addEventListener("message", (event) => {
        if (event.data.command === "changeName") {
            time = event.data.name;
        }
    });

    let menuData = {
        x: 0,
        y: 0,
        showMenu: false,
        port: undefined,
    };
    async function onRightClick(event, port) {
        if (menuData.showMenu) {
            menuData.showMenu = false;
            await new Promise((res) => setTimeout(res, 100));
        }
        const { x, y } = event;
        menuData.x = x;
        menuData.y = y;
        menuData.port = port;
        menuData.showMenu = true;
    }

    onRightClick({ x: 200, y: 200 }, ports[0]);

    function closeMenu() {
        menuData.showMenu = false;
    }

    let currentSelectPort = undefined;
    function selectRow(event, port, index) {
        currentSelectPort =
            currentSelectPort?.port === port.port ? undefined : port;
    }

    function menuCommand(event) {
        const { command, port } = event.detail;
        console.log("==========onMenuCommand", command, port);
        closeMenu();
    }

    let tableHovered = true;
</script>

<main>
    <Resizable>
        <span>HELLOWORLD</span>
    </Resizable>
    <ContextMenu
        {...menuData}
        on:clickoutside={closeMenu}
        on:command={menuCommand}
    />
    <table class:table-hover={tableHovered}>
        <tr>
            <th />
            {#each headers as header (header.label)}
                <th>{header.label}</th>
            {/each}
        </tr>
        {#each mappedPorts as port, i (port.port)}
            <tr
                class="tr-data"
                class:tr-select={currentSelectPort?.port === port.port}
                on:click={(e) => selectRow(e, port)}
                on:contextmenu|preventDefault={(event) =>
                    onRightClick(event, port)}
            >
                <td>
                    <div>o</div>
                </td>
                {#each headers as header (header.label)}
                    <td><div>{@html port[header.field]}</div></td>
                {/each}
            </tr>
        {/each}
    </table>
    <span hidden class="tr-select" />
</main>

<style>
    table {
        width: 100%;
        height: 100%;
        border-collapse: collapse;
        font-size: 13px;
        border-spacing: 0;
    }
    tr {
        height: 22px;
        line-height: 22px;
    }
    td,
    th {
        text-align: left;
        padding-left: 10px;
        border-width: 0px 1px 0px 1px;
        border-collapse: collapse;
        border-style: solid;
        border-color: transparent;
    }

    th,
    td {
        resize: horizontal;
        overflow: auto;
    }

    ::-webkit-resizer {
        /*size does not work*/
        display: block;
        width: 150px !important;
        /* height: 150px !important; */
        width: 2px;
        background-color: red;
        height: 300px !important;
    }

    td {
        overflow: auto;
    }
    td > div {
        resize: both;
    }

    /* .table-hover td {
        border-color: gray !important;
    } */

    th {
        font-weight: 700;
    }
    .tr-data:hover {
        background-color: var(--vscode-toolbar-hoverBackground);
    }
    .tr-data::selection {
        background-color: var(--vscode-toolbar-hoverBackground);
    }

    .tr-select {
        background-color: var(--vscode-menu-selectionBackground) !important;
    }
</style>
