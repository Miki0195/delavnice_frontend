const VisionSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-16 bg-primary rounded-full" />
            <h2 className="text-4xl font-bold text-primary">
              Naša vizija = krepitev učinkovitosti preventivne dejavnosti
            </h2>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed">
            Na platformi delavnice.net verjamemo, da je prihodnost preventive v
            znanstveno podprtih in kakovostno izvedenih programih, ki ne le
            preprečujejo tveganja, temveč tudi aktivno spodbujajo zdrav razvoj otrok
            in mladostnikov. Naša vizija je ustvariti prostor, kjer bodo šole,
            ponudniki in skupnost sodelovali pri gradnji varnejšega in bolj
            spodbudnega okolja za prihodnje generacije.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;

