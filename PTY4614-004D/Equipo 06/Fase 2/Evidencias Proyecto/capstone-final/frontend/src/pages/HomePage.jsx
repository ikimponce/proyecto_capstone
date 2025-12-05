import Carrusel from "../components/Carrusel";
import csgog from "../assets/img/grupocsgo.jpg";
import grupop from "../assets/img/grupop.jpg";
import fp from "../assets/img/fp.jpg";
import handshake from "../assets/img/handshake.jpg";
import PublicNavbar from "../components/PublicNavbar";
import { Link } from "react-router-dom";

export default function HomePage() {
  const sections = [
    {
      id: 1,
      img: csgog,
      text: "Explora nuevas experiencias digitales diseñadas para impulsar tu creatividad y colaboración. Sumérgete en un espacio pensado para conectar jugadores con intereses afines, descubrir comunidades vibrantes y formar equipos para tus juegos favoritos. Aquí podrás compartir ideas, coordinar partidas y encontrar nuevos compañeros de aventura, todo a través de una plataforma intuitiva y enfocada en potenciar cada momento de tu experiencia gamer.",
    },
    {
      id: 2,
      img: grupop,
      text: "Conecta con tu equipo en espacios interactivos, comparte ideas y lleva los proyectos al siguiente nivel. Descubre una plataforma creada para fortalecer la comunicación entre jugadores, coordinar estrategias y fomentar la colaboración en cada partida. Aquí podrás organizar tus grupos de juego, planificar sesiones y desarrollar nuevas tácticas junto a una comunidad comprometida con alcanzar objetivos comunes y disfrutar al máximo de cada experiencia.",
    },
    {
      id: 3,
      img: handshake,
      text: "Crea nuevas amistades o grupos de juego. Únete a una comunidad donde conectar con otros jugadores es sencillo y natural, ya sea para disfrutar partidas casuales, formar equipos competitivos o simplemente compartir tu pasión por los videojuegos. Aquí podrás encontrar personas con intereses similares, iniciar conversaciones, organizar encuentros y construir vínculos que transformen cada sesión de juego en una experiencia más divertida, cercana y significativa.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 text-white">
      <PublicNavbar />
      <Carrusel />
      
      <div className="flex flex-col items-center py-16 px-6 gap-16 min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950">
        {sections.map((item, i) => (
          <div
            key={item.id}
            className={`flex flex-col md:flex-row ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            } items-stretch bg-white/5 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl w-full max-w-5xl overflow-hidden hover:border-purple-500/50 transition-all duration-300`}
          >
            {/* IMAGEN: toda la altura + mask hacia el texto */}
            <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[300px]">
              <img
                src={item.img}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Mask degradado hacia el lado del texto */}
              <div
                className="absolute inset-0 bg-black/60"
                style={{
                  maskImage:
                    i % 2 === 0
                      ? "linear-gradient(to right, transparent 50%, black 100%)"
                      : "linear-gradient(to left, transparent 50%, black 100%)",
                  maskSize: "100% 100%",
                }}
              />
            </div>

            {/* TEXTO: ocupa toda la altura y se alinea al centro */}
            <div className="flex items-center justify-center w-full md:w-1/2 p-8 md:p-12">
              <p className="text-white text-lg lg:text-xl leading-relaxed text-center md:text-left">
                {item.text}
              </p>
            </div>
          </div>
        ))}

        {/* Botón final */}
        <div className="flex justify-center pb-20">
          <Link
            to="/register"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-10 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/50"
          >
            Regístrate ahora
          </Link>
        </div>
      </div>
    </div>
  );
}