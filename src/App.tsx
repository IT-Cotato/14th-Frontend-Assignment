import { useState } from 'react'
import MemberCardTemplate, {
  type MemberProfile,
} from './templates/MemberCardTemplate'
import './App.css'
import potato01 from './assets/potato-01.png'
import potato02 from './assets/potato-02.png'
import potato03 from './assets/potato-03.png'
import potato04 from './assets/potato-04.png'
import potato05 from './assets/potato-05.png'
import potato06 from './assets/potato-06.png'
import potato07 from './assets/potato-07.png'
import potato08 from './assets/potato-08.png'
import potato09 from './assets/potato-09.png'
import potato10 from './assets/potato-10.png'
import potato11 from './assets/potato-11.png'
import potato12 from './assets/potato-12.png'
import potato13 from './assets/potato-13.png'
import potato14 from './assets/potato-14.png'

const potatoes = [
  { id: 'potato-01', image: potato01, left: 45, top: 48, size: 13 },
  { id: 'potato-02', image: potato02, left: 93, top: 32, size: 11 },
  { id: 'potato-03', image: potato03, left: 32, top: 68, size: 12 },
  { id: 'potato-04', image: potato04, left: 45, top: 84, size: 10 },
  { id: 'potato-05', image: potato05, left: 50, top: 66, size: 13 },
  { id: 'potato-06', image: potato06, left: 60, top: 84, size: 11 },
  { id: 'potato-07', image: potato07, left: 70, top: 65, size: 12 },
  { id: 'potato-08', image: potato08, left: 79, top: 82, size: 11 },
  { id: 'potato-09', image: potato09, left: 91, top: 74, size: 13 },
  { id: 'potato-10', image: potato10, left: 27, top: 88, size: 9 },
  { id: 'potato-11', image: potato11, left: 63, top: 42, size: 10 },
  { id: 'potato-12', image: potato12, left: 10, top: 88, size: 9 },
  { id: 'potato-13', image: potato13, left: 80, top: 45, size: 10 },
  { id: 'potato-14', image: potato14, left: 12, top: 58, size: 9 },
]

const defaultProfile: MemberProfile = {
  potatoId: 'potato-00',
  name: '000',
  age: '00년생',
  school: '00대학교',
  major: '00전공',
  mbti: '0000',
  hobby: '취미를 입력해주세요',
  message: '한마디를 남겨주세요',
}

type MemberModule = { memberProfile?: MemberProfile }

const memberModules = import.meta.glob('./members/*.tsx', {
  eager: true,
}) as Record<string, MemberModule>

const profilesByPotatoId = new Map(
  Object.values(memberModules)
    .map((module) => module.memberProfile)
    .filter((profile): profile is MemberProfile => Boolean(profile))
    .map((profile) => [profile.potatoId, profile]),
)

function App() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const selectedPotato = selectedIndex === null ? null : potatoes[selectedIndex]
  const selectedProfile = selectedPotato
    ? profilesByPotatoId.get(selectedPotato.id) ?? defaultProfile
    : null
  const cardPosition = selectedPotato
    ? selectedPotato.left > 64
      ? {
          right: `${Math.max(100 - selectedPotato.left + 6, 3)}%`,
          top: `${Math.max(selectedPotato.top - 16, 32)}%`,
        }
      : {
          left: `${selectedPotato.left + 7}%`,
          top: `${Math.max(selectedPotato.top - 16, 32)}%`,
        }
    : undefined

  return (
    <main
      className="world"
      aria-label="Network01 멤버 소개 월드"
      onClick={() => setSelectedIndex(null)}
    >
      <div className="world__overlay" />
      <section className="world__intro">
        <p className="world__eyebrow">COTATO 14기 · FRONTEND NETWORKING</p>
        <h1>우리들의 감자밭</h1>
        <p>감자를 클릭하면 멤버 소개를 확인할 수 있어요.</p>
      </section>
      <div className="potato-field" aria-label="COTATO 14기 멤버들">
        {potatoes.map((potato, index) => (
          <button
            className="potato"
            key={potato.image}
            type="button"
            aria-label={`멤버 ${index + 1} 소개 열기`}
            aria-pressed={selectedIndex === index}
            onClick={(event) => {
              event.stopPropagation()
              setSelectedIndex(index)
            }}
            style={{
              left: `${potato.left}%`,
              top: `${potato.top}%`,
              width: `${potato.size}vw`,
            }}
          >
            <img src={potato.image} alt="" />
          </button>
        ))}
      </div>
      {selectedPotato && selectedIndex !== null && selectedProfile && (
        <MemberCardTemplate
          profile={selectedProfile}
          style={cardPosition}
          onClose={() => setSelectedIndex(null)}
          onClick={(event) => event.stopPropagation()}
        />
      )}
    </main>
  )
}

export default App
