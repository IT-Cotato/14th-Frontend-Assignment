export interface Pokemon {
  id: string;
  name: string;
  image: string;
  type: string;
}

export const TYPE_BG_CLASS: Record<string, string> = {
  electric: "bg-type-electric",
  fire: "bg-type-fire",
  grass: "bg-type-grass",
  water: "bg-type-water",
};
