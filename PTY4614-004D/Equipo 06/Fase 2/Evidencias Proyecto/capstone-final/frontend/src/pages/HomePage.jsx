import Carrusel from '../components/Carrusel'
import csgog from '../assets/img/grupocsgo.jpg'
import grupop from '../assets/img/grupop.jpg'
import handshake from '../assets/img/handshake.jpg'
import { Link } from 'react-router-dom'


export default function HomePage() {
  const sections = [
    {
      id: 1,
      img: csgog,
      text: "Explora nuevas experiencias digitales diseñadas para impulsar tu creatividad y colaboración."
    },
    {
      id: 2,
      img: grupop,
      text: "Conecta con tu equipo en espacios interactivos, comparte ideas y lleva los proyectos al siguiente nivel."
    },
    {
      id: 3,
      img: handshake,
      text: "Crea nuevas amistades o grupos de juego."
    }
  ]

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <Carrusel />

      <div className="flex flex-col items-center py-16 px-6 gap-16">
        {sections.map((item, i) => (
          <div
            key={item.id}
            className={`flex flex-col md:flex-row ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            } items-center bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-5xl`}
          >
            <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
              <img
                src={item.img}
                alt=""
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div className="text-white md:px-8 mt-6 md:mt-0 text-justify text-lg">
              {item.text}
            </div>
          </div>
        ))}
      </div>
       {/* Botón final */}
      <div className="flex justify-center pb-20">
        <Link
          to="/register"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
        >
          Regístrate ahora
        </Link>
      </div>
    </div>
  )
}
