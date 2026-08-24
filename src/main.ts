import {
	Notice,
	Plugin,
	WorkspaceLeaf,
	WorkspaceTabs,
} from "obsidian";

interface TabGroup {
	parent: WorkspaceTabs;
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
	 * Groups are ordered visually:
	 * left-to-right, then top-to-bottom.
	 */
	private getOrderedGroups(): TabGroup[] {
		const groupsByParent = new Map<
			WorkspaceTabs,
			WorkspaceLeaf[]
		>();

		this.app.workspace.iterateRootLeaves((leaf) => {
			if (!(leaf.parent instanceof WorkspaceTabs)) {
				return;
			}

			const leaves =
				groupsByParent.get(leaf.parent) ?? [];

			leaves.push(leaf);
			groupsByParent.set(leaf.parent, leaves);
		});

		const groups: TabGroup[] = [];

		for (const [parent, leaves] of groupsByParent) {
			const selectedLeaf =
				this.getSelectedLeafFromLeaves(leaves);

			if (!selectedLeaf) {
				continue;
			}

			const rect =
				selectedLeaf.view.containerEl.getBoundingClientRect();

			groups.push({
				parent,
				leaves,
				top: rect.top,
				left: rect.left,
			});
		}

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
	 * Finds the currently visible tab from a list of leaves.
	 */
	private getSelectedLeafFromLeaves(
		leaves: WorkspaceLeaf[],
	): WorkspaceLeaf | null {
		const visibleLeaf = leaves.find((leaf) =>
			leaf.view.containerEl.isShown(),
		);

		return visibleLeaf ?? leaves[0] ?? null;
	}

	/**
	 * Finds the currently selected tab inside a tab group.
	 */
	private getSelectedLeaf(
		group: TabGroup,
	): WorkspaceLeaf | null {
		return this.getSelectedLeafFromLeaves(group.leaves);
	}

	/**
	 * Focuses a tab group by its visual index.
	 */
	private async focusGroup(
		groupNumber: number,
	): Promise<void> {
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