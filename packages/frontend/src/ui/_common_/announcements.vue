<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div :class="$style.root">
	<MkA
		v-for="announcement in $i.unreadAnnouncements.filter(x => x.display === 'banner')"
		:key="announcement.id"
		:class="$style.item"
		:to="`/announcements/${announcement.id}`"
	>
		<span :class="$style.icon">
			<i v-if="announcement.icon === 'info'" class="ph-info ph-bold ph-lg"></i>
			<i v-else-if="announcement.icon === 'warning'" class="ph-warning ph-bold ph-lg" style="color: var(--warn);"></i>
			<i v-else-if="announcement.icon === 'error'" class="ph-x-circle ph-bold ph-lg" style="color: var(--error);"></i>
			<i v-else-if="announcement.icon === 'success'" class="ph-check ph-bold ph-lg" style="color: var(--success);"></i>
		</span>
		<span :class="$style.title">{{ announcement.title }}</span>
		<span :class="$style.body">{{ announcement.text }}</span>
	</MkA>
</div>
</template>

<script lang="ts" setup>
import { $i } from '@/account.js';
</script>

<style lang="scss" module>
.root {
	font-size: 15px;
	background: var(--panel);
}

.item {
	--height: 24px;
	font-size: 0.85em;

	display: flex;
	vertical-align: bottom;
	width: 100%;
	line-height: var(--height);
	height: var(--height);
	overflow: clip;
	contain: strict;
	background: var(--accent);
	color: var(--fgOnAccent);

	@container (max-width: 1000px) {
		display: block;
		text-align: center;

		> .body {
			display: none;
		}
	}
}

.icon {
	margin-left: 10px;
}

.title {
	padding: 0 10px;
	font-weight: bold;

	&:empty {
		display: none;
	}
}

.body {
	min-width: 0;
	flex: 1;
	overflow: clip;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
