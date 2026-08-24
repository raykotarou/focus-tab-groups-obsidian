import { Notice, Plugin, WorkspaceLeaf } from "obsidian";

interface TabGroup {
	element: HTMLElement;
	leaves: WorkspaceLeaf[];
	top: number;
	left: number;
}

export default class FocusTabGroupsPlugin extends Plugin {
	async onload(): Promise<void> {
		for (let groupNumber = 1; groupNumber <= 9; groupNumber++) {
			this.addCommand({
				id: `focus-tab-group-${groupNumber}`,
				name: `Focus tab group ${groupNumber}`,
				callback: () => {
					void this.focusGroup(groupNumber);
				},
			});
		}
	}

	/**
	 * Returns tab groups from the main editor area.
	 *
	 * Sidebars are excluded because iterateRootLeaves()
	 * only iterates leaves in the main workspace.
	 *
	 * Groups are ordered visually:
	 * left-to-right, then top-to-bottom.
	 */
	private getOrderedGroups(): TabGroup[] {
		const groupsByElement = new Map<HTMLElement, WorkspaceLeaf[]>();

		this.app.workspace.iterateRootLeaves((leaf) => {
			const groupElement = leaf.containerEl.closest(".workspace-tabs");

			if (!(groupElement instanceof HTMLElement)) {
				return;
			}

			const leaves = groupsByElement.get(groupElement) ?? [];

			leaves.push(leaf);
			groupsByElement.set(groupElement, leaves);
		});

		const groups = Array.from(groupsByElement.entries()).map(
			([element, leaves]) => {
				const rect = element.getBoundingClientRect();

				return {
					element,
					leaves,
					top: rect.top,
					left: rect.left,
				};
			},
		);

		const rowTolerance = 16;

		groups.sort((a, b) => {
			if (Math.abs(a.top - b.top) <= rowTolerance) {
				return a.left - b.left;
			}

			return a.top - b.top;
		});

		return groups;
	}

	/**
	 * Finds the currently selected tab inside a tab group.
	 */
	private getSelectedLeaf(group: TabGroup): WorkspaceLeaf | null {
		/*
		 * First try the leaf Obsidian marks as active.
		 */
		const activeLeaf = group.leaves.find((leaf) =>
			leaf.containerEl.classList.contains("mod-active"),
		);

		if (activeLeaf) {
			return activeLeaf;
		}

		/*
		 * For an unfocused group, find the tab whose content is currently visible.
		 */
		const visibleLeaf = group.leaves.find((leaf) => {
			const element = leaf.containerEl;
			const rect = element.getBoundingClientRect();
			const style = window.getComputedStyle(element);

			return (
				element.isConnected &&
				style.display !== "none" &&
				style.visibility !== "hidden" &&
				rect.width > 0 &&
				rect.height > 0
			);
		});

		return visibleLeaf ?? group.leaves[0] ?? null;
	}

	/**
	 * Focuses a tab group by its visual index.
	 */
	private async focusGroup(groupNumber: number): Promise<void> {
		const groups = this.getOrderedGroups();
		const group = groups[groupNumber - 1];

		if (!group) {
			new Notice(
				`Focus Tab Groups: group ${groupNumber} does not exist (${groups.length} available).`,
			);
			return;
		}

		const leaf = this.getSelectedLeaf(group);

		if (!leaf) {
			new Notice(
				`Focus Tab Groups: group ${groupNumber} has no tabs.`,
			);
			return;
		}

		await this.app.workspace.revealLeaf(leaf);

		this.app.workspace.setActiveLeaf(leaf, {
			focus: true,
		});
	}
}