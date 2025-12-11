import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo and Tagline */}
          <div>
            <Link to="/" className="flex items-center space-x-1 mb-4">
              <span className="text-2xl font-bold text-primary">delavnice</span>
              <span className="text-2xl font-bold text-gray-900">.net</span>
            </Link>
            <p className="text-gray-600 text-sm">
              Vaša pot do kakovostnih programov!
            </p>
          </div>

          {/* Uporabne povezave */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Uporabne povezave:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <ul className="space-y-2">
                  <li>
                    <Link to="/moj-profil" className="text-gray-600 hover:text-primary text-sm">
                      Moj profil
                    </Link>
                  </li>
                  <li>
                    <Link to="/zaznamki" className="text-gray-600 hover:text-primary text-sm">
                      Zaznamki
                    </Link>
                  </li>
                  <li>
                    <Link to="/moje-rezervacije" className="text-gray-600 hover:text-primary text-sm">
                      Moje rezervacije
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  <li>
                    <Link to="/moj-profil" className="text-gray-600 hover:text-primary text-sm">
                      Moj profil
                    </Link>
                  </li>
                  <li>
                    <Link to="/zaznamki" className="text-gray-600 hover:text-primary text-sm">
                      Zaznamki
                    </Link>
                  </li>
                  <li>
                    <Link to="/dodaj-oglas" className="text-gray-600 hover:text-primary text-sm">
                      Dodaj oglas
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Kontakt</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">Trenerska Akademija</p>
              <p className="text-gray-600">Slovenska cesta 56, 1000 Ljubljana</p>
              <a
                href="mailto:info@delavnice.net"
                className="text-primary hover:underline block"
              >
                info@delavnice.net
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>
            © 2023 Vse pravice pridržane. Delavnice.net | Avtorji:{' '}
            <a
              href="https://ado.si"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              ADO
            </a>
            ,{' '}
            <a
              href="https://www.ado.si"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Agencija za družbeno odgovornost
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

