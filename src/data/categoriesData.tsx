export interface Category {
  id: string;
  title: string;
  imageName: string; // TODO: Map to actual image imports later
  content: React.ReactNode;
}

export const categoriesData: Category[] = [
  {
    id: 'zdrav-zivljenjski-slog',
    title: 'Zdrav življenjski slog',
    imageName: 'zdrav-zivljenjski-slog.jpg',
    content: (
      <div className="space-y-6">
        <p className="text-lg text-gray-700 leading-relaxed">
          [Full content for Zdrav življenjski slog will be added here - this is a placeholder structure]
        </p>
        <h4 className="text-xl font-bold text-gray-900">Viri:</h4>
        <ul className="space-y-2 text-gray-700">
          <li>
            • Biddle, S. J. H., & Asare, M. (2011). Physical activity and mental health
            in children and adolescents: A review of reviews. <em>British Journal of
            Sports Medicine</em>, 45(11), 886–895.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'aktivno-drzavljanstvo',
    title: 'Aktivno državljanstvo',
    imageName: 'aktivno-drzavljanstvo.jpg',
    content: (
      <div className="space-y-6">
        <p className="text-lg text-gray-700 leading-relaxed">
          [Full content for Aktivno državljanstvo will be added here]
        </p>
      </div>
    ),
  },
  {
    id: 'dusevno-zdravje',
    title: 'Duševno zdravje',
    imageName: 'dusevno-zdravje.jpg',
    content: (
      <div className="space-y-6">
        <p className="text-lg text-gray-700 leading-relaxed">
          [Full content for Duševno zdravje will be added here]
        </p>
      </div>
    ),
  },
  {
    id: 'trajnostni-razvoj',
    title: 'Trajnostni razvoj',
    imageName: 'trajnostni-razvoj.jpg',
    content: (
      <div className="space-y-6">
        <p className="text-lg text-gray-700 leading-relaxed">
          [Full content for Trajnostni razvoj will be added here]
        </p>
      </div>
    ),
  },
  {
    id: 'etika-druz-odgovornost',
    title: 'Etika in družbena odgovornost',
    imageName: 'etika-druzben-odgovornost.jpg',
    content: (
      <div className="space-y-6">
        <p className="text-lg text-gray-700 leading-relaxed">
          [Full content for Etika in družbena odgovornost will be added here]
        </p>
      </div>
    ),
  },
  {
    id: 'zasvojenosti',
    title: 'Zasvojenosti',
    imageName: 'zasvojenosti.jpg',
    content: (
      <div className="space-y-6">
        <p className="text-lg text-gray-700 leading-relaxed">
          [Full content for Zasvojenosti will be added here]
        </p>
      </div>
    ),
  },
];

