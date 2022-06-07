<script>
    import ContextMenu from "./ContextMenu.svelte";
    let ports = "";
    window.addEventListener("message", (event) => {
        if (event.data.command === "updatePorts") {
            ports = event.data.ports.sort((a, b) => a.status.localPort - b.status.localPort);
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
            currentSelectPort?.status.localPort === port.status.localPort
                ? undefined
                : port;
    }

    function menuCommand(event) {
        const { command, port } = event.detail;
        vscode.postMessage({
            command,
            port,
        });
        closeMenu();
    }

    let tableHovered = true;
</script>

<main>
    <ContextMenu
        {...menuData}
        on:clickoutside={closeMenu}
        on:command={menuCommand}
    />
    <table class:table-hover={tableHovered}>
        <tr>
            <th width="40px" />
            <th width="120px">Port</th>
            <th>Local Address</th>
            <th width="140px">Running Process</th>
            <th width="120px">Visibility</th>
            <th width="120px">Origin</th>
        </tr>
        {#each ports as port, i (port.status.localPort)}
            <tr
                class="tr-data"
                class:tr-select={currentSelectPort &&
                    currentSelectPort.status.localPort ===
                        port.status.localPort}
                on:click={(e) => selectRow(e, port)}
                on:contextmenu|preventDefault={(event) =>
                    onRightClick(event, port)}
            >
                <td
                    class:served={port.status.served}
                    style="text-align: center"
                >
                    <!-- TODO(hw): How to use vscode.ThemeIcon (port.info.iconPath) here? If can't is `codicon` helpful for us? -->
                    o
                </td>
                <td>{port.info.label}</td>
                <td>
                    {#if (port.status.exposed?.url.length ?? 0) > 0}
                        <a href={port.status.exposed?.url}
                            >{port.status.exposed?.url}</a
                        >
                    {/if}
                </td>
                <td>
                    <!-- TODO(hw): no data for Running Process now -->
                </td>
                <td>
                    {#if port.status.served}
                        {port.status.exposed.visibility === 1
                            ? "public"
                            : "private"}
                    {/if}
                </td>
                <td>
                    <!-- TODO(hw): What is `Origin` ? -->
                    {port.info.contextValue}
                </td>
            </tr>
        {/each}
    </table>
</main>

<style>
    table {
        width: 100%;
        height: 100%;
        border-collapse: collapse;
        font-size: 13px;
        border-spacing: 0;
        table-layout: fixed;
    }
    tr {
        height: 22px;
        line-height: 22px;
    }
    td,
    th {
        text-align: left;
        padding: 0 8px;
        box-sizing: border-box;
        border-width: 0px 1px 0px 1px;
        border-collapse: collapse;
        border-style: solid;
        border-color: transparent;
        resize: horizontal;
    }
    td {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    ::-webkit-resizer {
        background-color: transparent;
    }

    .table-hover td {
        border-color: var(--vscode-scrollbarSlider-background) !important;
    }

    th {
        font-weight: 700;
    }
    /* tree.tableOddRowsBackground */
    .tr-data:nth-child(odd) {
        background-color: var(--vscode-tree-tableOddRowsBackground);
    }
    .tr-data:hover {
        background-color: var(--vscode-list-hoverBackground);
    }
    .tr-select {
        background-color: var(
            --vscode-list-activeSelectionBackground
        ) !important;
    }

    .served {
        color: green;
    }
</style>
