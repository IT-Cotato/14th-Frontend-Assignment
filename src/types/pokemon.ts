export interface Pokemon {
  id: string;
  name: string;
  image: string;
  type: string;
  role: string;
}

export const TYPE_BG_CLASS: Record<string, string> = {
  electric: "bg-type-electric",
  fire: "bg-type-fire",
  grass: "bg-type-grass",
  water: "bg-type-water",
};

export const TYPE_LABEL: Record<string, string> = {
  electric: "전기",
  fire: "불꽃",
  grass: "풀",
  water: "물",
};

export const MAX_TEAM_SIZE = 6;

export interface TeamMember {
  id: string;
}
