import Carrusel from "../components/Carrusel";
import csgog from "../assets/img/grupocsgo.jpg";
import grupop from "../assets/img/grupop.jpg";
import fp from "../assets/img/fp.jpg";
import handshake from "../assets/img/handshake.jpg";
import { Link } from "react-router-dom";

export default function HomePage() {
  const sections = [
    {
      id: 1,
      img: csgog,
      text: "Explora nuevas experiencias digitales diseñadas para impulsar tu creatividad y colaboración.",
    },
    {
      id: 2,
      img: grupop,
      text: "Conecta con tu equipo en espacios interactivos, comparte ideas y lleva los proyectos al siguiente nivel.",
    },
    {
      id: 3,
      img: handshake,
      text: "Crea nuevas amistades o grupos de juego.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <Carrusel />

      <div
        className="flex flex-col items-center py-16 px-6 gap-16 min-h-screen
             bg-gray-950 bg-repeat bg-[length:400px_400px] md:bg-[length:600px_600px]"
        style={{
          backgroundImage: `url(${fp})`,
        }}
      >
        {sections.map((item, i) => (
          <div
            key={item.id}
            className={`flex flex-col md:flex-row ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            } items-stretch bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden`}
          >
            {/* IMAGEN: toda la altura + mask hacia el texto */}
            <div className="relative w-full md:w-1/2 h-64 md:h-auto">
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
                      ? "linear-gradient(to right, transparent 50%, black 100%)" // imagen izq → desvanece a la derecha
                      : "linear-gradient(to left, transparent 50%, black 100%)", // imagen der → desvanece a la izquierda
                  maskSize: "100% 100%",
                }}
              />
            </div>

            {/* TEXTO: ocupa toda la altura y se alinea al centro */}
            <div className="flex items-center p-8 md:p-12 text-white text-lg lg:text-xl text-justify">
              <p>{item.text}</p>
            </div>
          </div>
        ))}{" "}
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
    </div>
  );
}
