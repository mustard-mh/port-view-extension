<script lang="ts">
    let time = new Date().toString();
    let ports: Array<number> = [1, 2, 3];
    window.addEventListener("message", (event) => {
        if (event.data.command === "changeName") {
            time = event.data.name;
        }
    });
</script>

<main>
    <h1>Hello World11!</h1>
    <p>
        Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
        how to build Svelte apps.
    </p>
    <p>
        Current time is {time}!
    </p>
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
