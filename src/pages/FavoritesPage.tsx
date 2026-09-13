import { useMemo } from "react";
import { useFavoritesStore } from "@/modules/countries/core/store/favorites.store";
import { CreateGroupForm } from "@/modules/countries/presentation/CreateGroupForm";
import { GroupSection } from "@/modules/countries/presentation/GroupSection";
import { EmptyState } from "@/shared/presentation/EmptyState";

export function FavoritesPage() {
  const { favorites, groups, createGroup, deleteGroup, assignToGroup, deleteFavorite } = useFavoritesStore();

  const ungrouped = useMemo(() => favorites.filter((favorite) => favorite.groupId === null), [favorites]);

  if (favorites.length === 0 && groups.length === 0) {
    return (
      <EmptyState>
        You haven't favourited any countries yet — search for a country and tap the heart icon to add one.
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <CreateGroupForm onCreate={createGroup} />
      {groups.map((group) => (
        <GroupSection
          key={group.id}
          title={group.name}
          group={group}
          favorites={favorites.filter((favorite) => favorite.groupId === group.id)}
          groups={groups}
          onAssignGroup={assignToGroup}
          onRemoveFavorite={deleteFavorite}
          onDeleteGroup={deleteGroup}
        />
      ))}
      <GroupSection
        title="Ungrouped"
        group={null}
        favorites={ungrouped}
        groups={groups}
        onAssignGroup={assignToGroup}
        onRemoveFavorite={deleteFavorite}
      />
    </div>
  );
}
