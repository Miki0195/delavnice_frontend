const MissionSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8">
            Naše poslanstvo
          </h2>

          <p className="text-xl text-gray-800 mb-8 leading-relaxed font-medium">
            Delavnice.net so več kot iskalnik; so sistem, ki gradi bolj zdravo in
            varno šolsko okolje, kjer je preventiva enostavna in standardna praksa.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Filter za kakovost:
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Trg je poln z nepreverjenimi ponudniki – delavnice.net poskrbijo, da
                v šole pridejo vsebine, katerih kakovost je razvidna skozi
                transparentne ocene in preverjenost s strani uporabnikov. Šolam
                ponujamo jasen sistem ocen in mnenj, ki krepi zaupanje ter
                odgovornost izvajalcev.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Orodje za učinkovitost:
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Namesto izgubljenih ur z iskanjem, klicanjem in usklajevanjem,
                delavnice.net celoten proces avtomatizira in centralizira. Šole z
                nekaj kliki dostopajo do preverjenih programov, rezervacij in
                dokumentacije, izvajalcem pa platforma služi kot glavni tržni in
                administrativni kanal, ki jim omogoča fokus na vsebino.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;

