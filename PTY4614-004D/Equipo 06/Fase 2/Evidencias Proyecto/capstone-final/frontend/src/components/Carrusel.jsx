//Carrusel.jsx
import csgo from '../assets/img/csgo.jpg'
import over from '../assets/img/overwatch.jpg'
import valo from '../assets/img/valo.jpg'
import b6 from '../assets/img/battle6.jpg'

export default function Carrusel() {
  const slides = [
    csgo,
    over,
    valo
  ]

  return (
    <div className="relative w-full h-[60vh] overflow-hidden">
      <div className="flex w-full h-full animate-slide">
        {slides.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`slide-${i}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <h1 className="absolute bottom-10 left-10 text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
        Bienvenido a SAFEZONE
      </h1>
    </div>
  )
}
