<script>
    import { createEventDispatcher } from "svelte";

    export let x = 0;
    export let y = 0;
    export let port = undefined;
    export let showMenu = false;

    let menuEl;
    const dispatch = createEventDispatcher();
    function onPageClick(e) {
        if (!showMenu) return;
        if (e.target === menuEl || menuEl.contains(e.target)) return;
        dispatch("clickoutside");
    }

    $: (() => {
        if (!showMenu || !menuEl) return;
        const rect = menuEl.getBoundingClientRect();
        x = Math.min(window.innerWidth - rect.width, x);
        if (y > window.innerHeight - rect.height) y -= rect.height;
    })(x, y);

    const menuOptions = [
        { command: "openBrowser", label: "Open in Browser", desc: "" },
        { command: "openPreview", label: "Preview in Editor", desc: "" },
        { type: "divider" },
        {
            command: "makePublic",
            label: "Switch Port Public/Private",
            desc: "cmd+x",
        },
    ];

    function selectCommand(command) {
        dispatch("command", { command, port });
    }
</script>

<main>
    {#if showMenu}
        <div class="menu" bind:this={menuEl} style="top: {y}px; left: {x}px;">
            {#each menuOptions as menu}
                {#if menu.type === "divider"}
                    <div class="divider" />
                {:else}
                    <div
                        class="opt"
                        on:click={() => selectCommand(menu.command)}
                    >
                        {menu.label}
                        <span>{menu.desc}</span>
                    </div>
                {/if}
            {/each}
        </div>
    {/if}
</main>

<svelte:window on:click={onPageClick} />

<style>
    .menu {
        position: absolute;
        display: grid;
        width: 300px;
        border: 1px solid var(--vscode-menu-selectionBorder);
        background-color: var(--vscode-menu-background);
    }
    .opt {
        cursor: pointer;
        padding: 6px 16px;
        position: relative;
    }
    .opt > span {
        float: right;
    }
    .divider {
        margin: 4px 8px;
        border-bottom: 1px solid var(--vscode-textSeparator-foreground);
    }
    .opt:hover {
        background-color: var(--vscode-list-activeSelectionBackground);
    }
</style>
