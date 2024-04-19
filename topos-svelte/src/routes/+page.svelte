<script>
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Editor from '$lib/components/Editor.svelte';
</script>

<div class="app-container">
	<Header />
	<div class="flex">
		<Sidebar />
		<Editor />
	</div>
</div>
