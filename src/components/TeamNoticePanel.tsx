import StatePanel from "./StatePanel";
import { MAX_TEAM_SIZE, withTopicParticle, type TeamMember } from "./teamTypes";

type TeamNoticePanelProps = {
  team: TeamMember[];
  duplicateName: string | null;
};

function TeamNoticePanel({ team, duplicateName }: TeamNoticePanelProps) {
  // 이미 있는 포켓몬을 눌렀을 때 (3초 동안)
  if (duplicateName) {
    return (
      <StatePanel
        symbol="!"
        title="이미 팀에 있는 포켓몬이에요"
        description={`${withTopicParticle(duplicateName)} 이미 내 팀에 있어요. 같은 포켓몬은 한 번만 추가할 수 있어요.`}
      />
    );
  }

  // 팀이 가득 찼을 때 (계속 표시)
  if (team.length >= MAX_TEAM_SIZE) {
    return (
      <StatePanel
        symbol={String(MAX_TEAM_SIZE)}
        title="팀이 가득 찼어요"
        description={`팀은 최대 ${MAX_TEAM_SIZE}마리까지 만들 수 있어요. 내 팀에서 포켓몬을 삭제하면 다시 추가할 수 있어요.`}
      />
    );
  }

  return null;
}

export default TeamNoticePanel;