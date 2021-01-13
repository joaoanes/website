<script>
	import PageContainer from './PageContainer.svelte';
	// export let store;
	import { store } from './Store.svelte'
	const {name, title, subtitle, quote, description, lookingFor} = store;
</script>

<PageContainer>
	<div class="left">
		<div class="name-container">
			<h1 class="name">{name}</h1>
			<span class="title">{title}</span>
			<div class="divider" />
			<h3 class="subtitle">{subtitle}</h3>
		</div>
	</div>
	<div class="right">
		<div class="name-container">
			<span class="quote"><h2>{quote}</h2></span>
			<div class="description">
				{#each description as desc}
					<span>{desc}</span>
				{/each}
			</div>
			<span class="lookingFor">{lookingFor}</span>
		</div>
	</div>
</PageContainer>

<PageContainer> 
	<div class="left">left</div>
	<div class="right">right</div>
</PageContainer>


<style>
	.left {
		flex-grow: 1;
		flex-shrink: 0;
		width: 50%;
	}

	h1 {
		font-size: 80px;
	}

	h3, h4, h1 {
		margin: 0
	}

	.quote {
		font-family: 'Exo2Italic';
		font-weight: bolder;
		margin-top: 85px;
	}

	h3, .desc {
		font-weight: lighter;
	}

	.description {
		margin-top: 70px;
	}

	.title {
		font-size: 50px;
	}

	.name {
		font-size: 94px;
	}

	.lookingFor {
		margin-top: 20px;
	}

	.subtitle {
		margin-top: 40px;
		text-align: end;
		font-size: 20pt;
	}

	.name-container {
		display: flex;
		width: 80%;
		max-width: 500px;
		margin-left: auto;
		margin-right: auto;
		flex-direction: column;
	}
	
	.divider {
		height: 2px;
		width: 100%;
		background-color: black;
		margin-top: 40px;
	}
	
	.left, .right {
		flex-grow: 1;
		flex-shrink: 0;
		width: 50%;
		display: flex;
		align-items: center;
	}
</style>

