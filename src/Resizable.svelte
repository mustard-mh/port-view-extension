<script>
    export let direction = "horizontal"; // horizontal vertical...
    $: isHorizontal = direction === "horizontal";
</script>

<main>
    <div class="container">
        <slot />
        <span
            class="resizer"
            class:resizer-h={isHorizontal}
            class:resizer-v={!isHorizontal}
        />
    </div>
</main>

<style>
    .container {
        position: relative;
    }
    .resizer {
        position: absolute;
        background-color: green;
    }
    .resizer:hover {
        background-color: red;
    }
    .resizer-h {
        height: 100%;
    }
    .resizer-v {
        width: 100%;
    }
</style>
