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
  { image: potato01, left: 45, top: 48, size: 13 },
  { image: potato02, left: 19, top: 76, size: 11 },
  { image: potato03, left: 32, top: 68, size: 12 },
  { image: potato04, left: 43, top: 84, size: 10 },
  { image: potato05, left: 50, top: 66, size: 13 },
  { image: potato06, left: 58, top: 81, size: 11 },
  { image: potato07, left: 68, top: 68, size: 12 },
  { image: potato08, left: 80, top: 82, size: 11 },
  { image: potato09, left: 91, top: 74, size: 13 },
  { image: potato10, left: 27, top: 91, size: 9 },
  { image: potato11, left: 63, top: 42, size: 10 },
  { image: potato12, left: 9, top: 88, size: 9 },
  { image: potato13, left: 80, top: 45, size: 10 },
  { image: potato14, left: 90, top: 33, size: 9 },
]

function App() {
  return (
    <main className="world" aria-label="Network01 멤버 소개 월드">
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
    </main>
  )
}

export default App
