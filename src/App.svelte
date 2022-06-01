<script>
    import Tailwindcss from "./Tailwind.svelte";
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
    window.addEventListener("message", (event) => {
        if (event.data.command === "changeName") {
            time = event.data.name;
        }
    });
</script>

<main class="text-center">
    <div class="table-container">
        <div class="header-container flex">
            {#each headers as header (header.label)}
                <div class="header-cell text-green-700">{header.label}</div>
            {/each}
        </div>
    </div>
</main>

<style>
</style>
