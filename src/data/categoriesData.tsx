import aktivnoImg from "../assets/images/aktivno-drzavljanstvo-delavnice.png";
import dusevnoImg from "../assets/images/dusevno-zdravje-delavnice.png";
import trajnostniImg from "../assets/images/trajnostni-razvoj-delavnice.png";
import etikaImg from "../assets/images/clovekove-pravice-delavnice.png";
import zasvojenostiImg from "../assets/images/zasvojenost-delavnice.png";

export interface Category {
  id: string;
  title: string;
  imageName: string; 
  content: React.ReactNode;
}

export const categoriesData: Category[] = [
  {
    id: 'zdrav-zivljenjski-slog',
    title: 'Zdrav življenjski slog',
    imageName: 'zdrav-zivljenjski-slog.jpg',
    content: (
      <div className="space-y-6">
        <p className="text-md text-gray-700 leading-relaxed">
          Spodbujanje zdravega življenjskega sloga v mladosti ima ključno vlogo pri oblikovanju dolgoročnih navad, ki vplivajo na fizično, duševno in socialno dobrobit posameznika. Mladostniško obdobje je čas hitrega razvoja, v katerem se utrjujejo vedenjski vzorci, zato je <b>zgodnja vzgoja za zdrav življenjski slog naložba v prihodnost.</b> Vključuje gibanje, uravnoteženo prehrano, dovolj spanja, ustrezno higieno, izogibanje tveganim vedenjem (npr. kajenju, pretiranemu pitju alkohola, zlorabi zaslonov) ter aktivno preživljanje prostega časa.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Svetovna zdravstvena organizacija poudarja, da se številne <b>kronične nenalezljive bolezni (srčno-žilne bolezni, diabetes tipa 2, nekatere vrste raka)</b> začnejo razvijati že v mladosti, pogosto kot posledica nezdravih navad (WHO, 2018). Preventivni programi, ki mlade vključujejo v interaktivne aktivnosti, delavnice, športne dogodke in ozaveščevalne kampanje, dokazano povečujejo njihovo <b>motivacijo za spremembo vedenja</b>, prispevajo k večji <b>samoevalvaciji življenjskih navad</b> in zmanjšujejo verjetnost za razvoj debelosti in drugih zapletov.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Zdrav življenjski slog ima tudi pomembno vlogo pri duševnem zdravju mladih – redna telesna dejavnost, kakovostna prehrana in zadostna količina spanja <b>znižujejo tveganje za anksioznost in depresijo</b>, izboljšujejo kognitivne sposobnosti in krepijo samozavest (Biddle in Asare, 2011). Poleg tega lahko skupinske dejavnosti <b>povečajo socialno vključenost, okrepijo občutek pripadnosti ter zmanjšajo izolacijo</b> in zasvojenost z digitalnimi vsebinami.
        </p>
        <p className="text-md text-gray-700 leading-relaxed"> 
          Širši vpliv je prav tako pomemben. Mladi, ki razvijejo pozitiven odnos do zdravja, so bolj verjetno odgovorni člani skupnosti, ki vplivajo tudi na <b>zdravstvene odločitve svojih vrstnikov in družinskih članov</b>, kar ima multiplikativen učinek na javno zdravje.
        </p>
        <h4 className="text-xl font-bold text-gray-900">Viri:</h4>
        <ul className="space-y-2 text-gray-700">
          <li>
            • Biddle, S. J. H., & Asare, M. (2011). Physical activity and mental health
            in children and adolescents: A review of reviews. <em>British Journal of
            Sports Medicine</em>, 45(11), 886–895.
          </li>
          <li>
            • Inchley, J., Currie, D., Budisavljevic, S., Torsheim, T., Jåstad, A., Cosma, A., & Arnarsson, Á. M. (2020). <em>Spotlight on adolescent health and well-being: Findings from the 2017/2018 Health Behaviour in School-aged Children (HBSC) survey in Europe and Canada.</em> WHO Regional Office for Europe.
          </li>
          <li>
            • WHO (2018). <em>Noncommunicable diseases: Key facts.</em> <br/><a href="https://www.who.int/news-room/fact-sheets/detail/noncommunicable-diseases" target="_blank" rel="norefferer">https://www.who.int/news-room/fact-sheets/detail/noncommunicable-diseases</a>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'aktivno-drzavljanstvo',
    title: 'Aktivno državljanstvo',
    imageName: aktivnoImg,
    content: (
      <div className="space-y-6">
        <p className="text-md text-gray-700 leading-relaxed">
          Spodbujanje aktivnega državljanstva med mladimi je ključno za oblikovanje odgovornih, kritično mislečih in v skupnost vključenih posameznikov. Aktivno državljanstvo pomeni <b>zavestno sodelovanje v družbenem in političnem življenju</b>, zavzemanje za skupno dobro, spoštovanje človekovih pravic in temeljnih svoboščin ter pripravljenost sodelovati pri oblikovanju odločitev, ki vplivajo na skupnost. Pri mladih se to kaže v sodelovanju v šolskih skupnostih, mladinskih organizacijah, prostovoljstvu, izražanju mnenj ter zavedanju svojih pravic in dolžnosti.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Po podatkih poročila Citizenship Education at School in Europe (Eurydice, 2017) <b>manj kot 50 % mladih Evropejcev meni, da jih politika neposredno zadeva</b>, še manj pa jih ima izkušnje z aktivnim sodelovanjem v strukturah odločanja. Kljub temu več kot 80 % mladih izraža pripravljenost sodelovati v družbeno koristnih aktivnostih, če bi imeli primerno priložnost in podporo. Ta razkorak med pripravljenostjo in udeležbo poudarja potrebo po strukturiranih, vključujočih in mladim dostopnih programih državljanske vzgoje.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Zgodnje vključevanje mladih v demokratične procese in civilno udejstvovanje dokazano <b>povečuje občutek pripadnosti, krepi zaupanje v institucije</b> in razvija občutek za odgovornost do družbe. Hoskins in Mascherini (2009) poudarjata, da aktivno državljanstvo ni zgolj rezultat formalnega znanja, temveč predvsem praktičnega udejstvovanja in razvijanja t. i. državljanskih kompetenc – od sodelovanja in pogajanja do reševanja konfliktov in zavzemanja za pravičnost.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Svet Evrope je zato razvil <b>Kompetenčni model za demokratično kulturo</b>, ki vključuje vrednote (npr. človekove pravice, dostojanstvo, enakost), držo (npr. odprtost, odgovornost, spoštovanje raznolikosti), veščine (npr. kritično mišljenje, sodelovanje) in znanja. Model spodbuja države, šole in organizacije k <b>celostni vzgoji za aktivno državljanstvo</b> (Council of Europe, 2016). Preventivni programi mladim omogočajo konkretne izkušnje sodelovanja, denimo simulacije volitev in občinskih sej, mladinske projekte, kampanje za človekove pravice in lokalne iniciative.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Primer dobre prakse je denimo program <b>"Parlament mladih"</b> v različnih evropskih državah, kjer mladi v simulacijskem okolju razpravljajo o zakonodajnih pobudah, pripravljajo resolucije in sodelujejo z odločevalci. Podobno programi Erasmus+ podpirajo <b>strateške projekte mladih</b>, v katerih se prepletajo aktivno državljanstvo, solidarnost in inovativni pristopi k reševanju družbenih izzivov.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Posebej pomembno je vključevanje mladih z manj priložnostmi – tistih, ki so zaradi socialnih, ekonomskih ali geografskih razlogov pogosto izključeni iz oblik participacije. Preventivni programi, ki naslavljajo aktivno državljanstvo, tem mladim <b>odpirajo prostor za izražanje, vidnost in vpliv</b>, s čimer krepijo socialno kohezijo in demokratične vrednote celotne družbe.
        </p>
        <h4 className="text-xl font-bold text-gray-900">Viri:</h4>
        <ul className="space-y-2 text-gray-700">
          <li>
            • Council of Europe (2016). <em>Competences for Democratic Culture: Living together as equals in culturally diverse democratic societies.</em> <br/> <a href="https://www.coe.int/en/web/education/competences-for-democratic-culture" target="_blank" rel="norefferer">https://www.coe.int/en/web/education/competences-for-democratic-culture</a>
          </li>
          <li>
            • European Commission/EACEA/Eurydice (2017). <em>Citizenship Education at School in Europe – 2017.</em> <br/> Eurydice Report. <a href="https://eurydice.eacea.ec.europa.eu/" target="_blank" rel="norefferer">https://eurydice.eacea.ec.europa.eu/</a> 
          </li>
          <li>
            • Hoskins, B., & Mascherini, M. (2009). <em>Measuring Active Citizenship through the Development of a Composite Indicator.</em> Social Indicators Research, 90, 459–488.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'dusevno-zdravje',
    title: 'Duševno zdravje',
    imageName: dusevnoImg,
    content: (
      <div className="space-y-6">
        <p className="text-md text-gray-700 leading-relaxed">
          Duševno zdravje predstavlja temelj za celosten razvoj mladostnika in močno vpliva na njegovo sposobnost učenja, vzpostavljanja zdravih odnosov, sprejemanja odločitev ter oblikovanja pozitivne samopodobe. Raziskave kažejo, da se kar <b>50 % vseh duševnih motenj razvije pred 14. letom starosti</b>, 75 % pa pred dopolnjenim 24. letom, kar kaže na izredno ranljivo življenjsko obdobje (Kessler et al., 2005). Zato je izjemno pomembno, da mladim že zgodaj omogočimo varna okolja, kjer lahko spregovorijo o svojih občutkih, razvijajo čustveno pismenost ter krepijo veščine obvladovanja stresa in konfliktov.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Preventivni programi, ki vključujejo tematike duševnega zdravja, dokazano <b>zmanjšujejo stigmo</b>, spodbujajo pomoč in iskanje virov pomoči ter prispevajo k <b>večji psihološki odpornosti</b> mladih (WHO, 2021). Poleg tega krepijo sposobnosti za prepoznavanje in uravnavanje čustev, razvijanje empatije ter učinkovito reševanje težav – vse to so ključne veščine za dobrobit in uspešnost v življenju. Šole in mladinske organizacije so pri tem v edinstvenem položaju, saj predstavljajo varna in dostopna okolja za sistematično izvajanje ter naslavljanje tovrstnih vsebin.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Naslavljanje duševnega zdravja ni pomembno le za preprečevanje motenj, temveč tudi za zagotavljanje dobrega duševnega zdravja in <b>opolnomočenje mladih</b>, da skrb za duševno zdravje postane del njihove vsakdanje rutine. S tem ne le izboljšamo trenutno počutje mladostnikov, temveč tudi <b>zmanjšujemo tveganje za dolgotrajne posledice</b> v odrasli dobi, vključno z depresijo, anksioznostjo, samomorilnostjo in zlorabo psihoaktivnih snovi (Patel et al., 2007).
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Pomembno je poudariti tudi širši družbeni učinek naslavljanja duševnega zdravja mladih. Duševno zdravi mladi so bolj vključeni v skupnost, bolj uspešni v šoli in kasneje na trgu dela, kar prispeva k bolj zdravi, povezani in odporni družbi. Raziskave potrjujejo, da obstaja <b>povezava med dobrim duševnim zdravjem in izobraževalnim uspehom</b>, saj mladi z visoko stopnjo psihološke blagostanja dosegajo boljše rezultate, so redkeje odsotni in bolj verjetno nadaljujejo izobraževanje (OECD, 2015). Poleg tega duševno zdravje vpliva na <b>zaposljivost in produktivnost</b>, saj so posamezniki z boljšo duševno kondicijo bolj sposobni za prilagajanje delovnim izzivom, timsko delo in dolgoročno načrtovanje kariere.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Mladostniki, ki zgodaj razvijejo čustveno inteligenco, odpornost in strategije za spoprijemanje s stresom, imajo večje možnosti za uspešno socialno vključevanje in aktivno državljanstvo v odraslosti. Preventivni programi s področja duševnega zdravja zato ne vplivajo le na posameznika, temveč tudi na <b>zmanjšanje bremena za zdravstveni sistem, socialne službe in delodajalce</b>, saj zmanjšujejo tveganje za dolgotrajne izpade zaradi duševnih stisk (Richter et al., 2019). To pomeni, da so preventivne aktivnosti, osredotočene na duševno zdravje mladih dolgoročno ekonomsko in socialno smiselne ter strateško pomembne za razvoj sodobnih družb.
        </p>
        <h4 className="text-xl font-bold text-gray-900">Viri:</h4>
        <ul className="space-y-2 text-gray-700">
          <li>
            • Kessler, R. C., Berglund, P., Demler, O., Jin, R., Merikangas, K. R., & Walters, E. E. (2005). <em>Lifetime prevalence and age-of-onset distributions of DSM-IV disorders in the National Comorbidity Survey Replication.</em> Archives of General Psychiatry, 62(6), 593–602.
          </li>
          <li>
            • OECD (2015). <em>Skills for Social Progress: The Power of Social and Emotional Skills.</em> <br/> <a href="https://www.oecd.org/education/skills-for-social-progress-9789264226159-en.html" target="_blank" rel="norefferer">https://www.oecd.org/education/skills-for-social-progress-9789264226159-en.html</a> 

          </li>
          <li>
            • Patel, V., Flisher, A. J., Hetrick, S., & McGorry, P. (2007). <em>Mental health of young people: a global public-health challenge.</em> The Lancet, 369(9569), 1302–1313.
          </li>
          <li>
            • Richter, D., Berger, K., & Riedel-Heller, S. G. (2019). <em>Mental health problems in the working population: a systematic review and meta-analysis.</em> Deutsches Ärzteblatt International, 116(46), 741–748.
          </li>
          <li>
            • WHO (2021). <em>Guidelines on mental health promotive and preventive interventions for adolescents: Helping adolescents thrive.</em>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'trajnostni-razvoj',
    title: 'Trajnostni razvoj',
    imageName: trajnostniImg,
    content: (
      <div className="space-y-6">
        <p className="text-md text-gray-700 leading-relaxed">
          Naslavljanje področja <b>trajnostnega razvoja</b> v preventivnih programih za mlade je danes nujno, saj mladi odraščajo v času <b>podnebnih sprememb, izgube biotske raznovrstnosti, naraščajoče socialne neenakosti in okoljskih kriz</b>, ki zahtevajo celostno razumevanje in aktivno odzivanje. Trajnostni razvoj ni več le okoljska tema, temveč koncept, ki povezuje <b>ekonomsko, socialno in okoljsko dimenzijo družbe</b>, pri čemer je ključna prav aktivna vloga mladih pri oblikovanju rešitev za prihodnost.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Zgodnje vključevanje mladih v teme, povezane s trajnostnim razvojem, pomembno prispeva k oblikovanju <b>odgovornega vedenja, kritičnega mišljenja, okoljske pismenosti in sposobnosti za dolgoročno načrtovanje.</b> Poročilo UNESCO poudarja, da je vzgoja za trajnostni razvoj (ESD – Education for Sustainable Development) eden najmočnejših orodij za doseganje ciljev Agende 2030, saj omogoča mladim, da postanejo <b>nosilci sprememb</b> in razvijejo kompetence za ustvarjanje trajnostne prihodnosti (UNESCO, 2020).
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Preventivni programi, ki vključujejo trajnostno tematiko, naj ne temeljijo le na prenosu informacij, temveč na <b>izkustvenem učenju, raziskovanju lokalnih izzivov in skupinskem ustvarjanju rešitev.</b> Tak pristop omogoča mladim, da razumejo <b>povezanost med lastnimi dejanji in globalnimi vplivi</b>, kar povečuje njihovo motivacijo za spremembe. Uspešni programi vključujejo aktivnosti, kot so urbani vrtovi, zero-waste izzivi, popravila oblačil, raziskovanje okoljskih politik ali simulacije mednarodnih pogajanj o podnebju.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Poročilo Eurydice (2021) opozarja, da je v večini evropskih držav poučevanje o trajnostnem razvoju še vedno <b>omejeno na posamezne predmete</b>, pogosto brez vključevanja mladih v konkretne akcije. Hkrati več kot 70 % mladih v EU izraža <b>zaskrbljenost zaradi podnebnih sprememb</b>, vendar ne vedo, kako lahko ukrepajo (Eurobarometer, 2022). Prav preventivni programi mladinskih organizacij in nevladnega sektorja lahko zapolnijo to vrzel, saj ponujajo <b>varno okolje za eksperimentiranje, učenje iz prakse in kolektivno delovanje.</b>
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Z vidika osebnostnega razvoja trajnostno naravnani programi <b>krepijo občutek smiselnosti, skupnosti in vpliva</b>, kar pozitivno vpliva tudi na duševno zdravje mladih, še posebej v času, ko se soočajo z občutkom nemoči in podnebne tesnobe (ang. climate anxiety). Ko mladi vidijo, da imajo lahko vpliv – četudi majhen – se poveča njihova <b>motivacija, odpornost in pripravljenost na aktivno udeležbo v družbi.</b>
        </p>
        <h4 className="text-xl font-bold text-gray-900">Viri:</h4>
        <ul className="space-y-2 text-gray-700">
          <li>
            • European Commission/EACEA/Eurydice (2021). <em>Education for Environmental Sustainability in Europe.</em> <br/> <a href="https://eurydice.eacea.ec.europa.eu" target="_blank" rel="norefferer">https://eurydice.eacea.ec.europa.eu</a> 
          </li>
          <li>
            • European Commission (2022). <em>Special Eurobarometer 513: Climate Change.</em> <br/> <a href="https://europa.eu/eurobarometer/surveys/detail/2609" target="_blank" rel="norefferer">https://europa.eu/eurobarometer/surveys/detail/2609</a> 
          </li>
          <li>
            • UNESCO (2020). <em>Education for Sustainable Development: A Roadmap.</em> <br/> <a href="https://unesdoc.unesco.org/ark:/48223/pf0000374802" target="_blank" rel="norefferer">https://unesdoc.unesco.org/ark:/48223/pf0000374802</a> 
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'etika-druz-odgovornost',
    title: 'Etika in družbena odgovornost',
    imageName: etikaImg,
    content: (
      <div className="space-y-6">
        <p className="text-md text-gray-700 leading-relaxed">
          Naslavljanje področja <b>etike in družbene odgovornosti</b> je ključno za celosten razvoj mladih, saj oblikuje njihov <b>notranji moralni kompas</b>, vpliva na vsakdanje odločitve in omogoča gradnjo osebne in družbene integritete. Če se aktivno državljanstvo osredotoča na participacijo v javnem življenju, se etika in družbena odgovornost nanašata na <b>osebno odgovornost posameznika za svoja dejanja</b> – tudi v situacijah, ko ni zunanjega nadzora ali formalnih struktur.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Etika vključuje sposobnost razlikovanja med prav in narobe, razvijanje <b>moralnega razmišljanja, empatičnega odzivanja in refleksije lastnega vedenja.</b> Družbena odgovornost se kaže kot zavest, da imajo naša dejanja vpliv na druge ljudi, skupnosti in okolje. Preventivni programi, ki se posvečajo tem vsebinam, omogočajo mladim razvoj <b>moralne občutljivosti, vrednotnega razmisleka in odgovornega odločanja</b> – kar pomembno prispeva k odpornosti na škodljive vplive vrstnikov, manipulacijo in normalizacijo neetičnega vedenja.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Narvaez (2010) poudarja, da se moralno razmišljanje ne razvije samodejno, temveč ga je treba <b>aktivno spodbujati s pomočjo pogovora, razmisleka in izkušenj z moralnimi dilemami</b>, ki mlade soočajo z vprašanji brez enoznačnih odgovorov. Prav tako opozarja, da posamezniki z višjo stopnjo moralnega funkcioniranja bolje prepoznajo kompleksnost družbenih situacij in so bolj odporni na enostavne rešitve ter manipulativne diskurze.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Svet Evrope v svojem kurikularnem okviru Competences for Democratic Culture posebej izpostavlja, da so <b>vrednote, kot so človekovo dostojanstvo, odgovornost, poštenost, sočutje in pravičnost</b>, nujne za delovanje demokratične družbe, vendar morajo biti <b>notranje ponotranjene</b>, ne zgolj poznane kot koncepti (Council of Europe, 2016). Vzgoja za etiko ni pouk moraliziranja, temveč oblikovanje sposobnosti za <b>kritično presojo, argumentacijo in osebno držo</b>, ki presega zakonodajo in formalen okvir vedenja
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Dolgoročno takšni programi spodbujajo <b>prosocialno vedenje</b>, zmanjšujejo tveganje za antisocialna vedenja ter povečujejo <b>občutek notranjega smisla</b> in pripadnosti skupnosti. Lerner s sodelavci (2011) v okviru raziskav o pozitivnem razvoju mladih ugotavlja, da se mladostniki, ki razvijejo občutek osebne in družbene odgovornosti, pogosteje vključujejo v prostovoljske dejavnosti, izkazujejo več sočutja in kažejo večjo pripravljenost pomagati drugim – tudi ko za to ne pričakujejo nagrade.
        </p>
        <h4 className="text-xl font-bold text-gray-900">Viri:</h4>
        <ul className="space-y-2 text-gray-700">
          <li>
            • Council of Europe (2016). <em>Competences for Democratic Culture: Living together as equals in culturally diverse democratic societies.</em> <br/> <a href="https://www.coe.int/en/web/education/competences-for-democratic-culture" target="_blank" rel="norefferer">https://www.coe.int/en/web/education/competences-for-democratic-culture</a> 
          </li>
          <li>
            • Lerner, R. M., Almerigi, J. B., Theokas, C., & Lerner, J. V. (2011). <em>Positive youth development: A view of the issues.</em> Journal of Early Adolescence, 25(1), 10–16.
          </li>
          <li>
            • Narvaez, D. (2010). <em>Moral complexity: The fatal attraction of truthiness and the importance of mature moral functioning.</em> Perspectives on Psychological Science, 5(2), 163–181.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'zasvojenosti',
    title: 'Zasvojenosti',
    imageName: zasvojenostiImg,
    content: (
      <div className="space-y-6">
        <p className="text-md text-gray-700 leading-relaxed">
          Tvegano vedenje in zasvojenosti predstavljajo eno najresnejših groženj za zdravje, varnost in prihodnost mladih. Mladostništvo je obdobje intenzivnega razvoja možganov, iskanja identitete, socialne primerjave in preizkušanja meja, zato so mladi naravno bolj nagnjeni k <b>eksperimentiranju z vedenji, ki lahko vodijo v zasvojenost ali škodljive posledice.</b> Sem sodijo pitje alkohola, uporaba tobaka, prepovedanih drog, pa tudi <b>vedenjske zasvojenosti</b>, kot so pretirana uporaba zaslonov, igranje iger na srečo, impulzivno nakupovanje in odvisnost od družbenih omrežij.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Raziskave kažejo, da večina poskusov uporabe psihoaktivnih snovi <b>prvič nastopi med 13. in 18. letom starosti</b> (ESPAD, 2020), pri čemer je zgodnji začetek povezan z večjo verjetnostjo dolgotrajne zasvojenosti in težav v odrasli dobi. Zato je <b>zgodnja preventiva</b> eden najučinkovitejših pristopov za zmanjševanje škodljivih učinkov. Programi, ki naslavljajo tvegano vedenje in zasvojenosti, prispevajo k <b>razvoju samoregulacije, odločanja, odpornosti na pritisk vrstnikov in razumevanja posledic vedenj.</b>
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Ključni zaščitni dejavniki, ki jih spodbujajo preventivni programi, vključujejo:
          <ul className="space-y-2 p-4">
            <li>• krepitev osebne odgovornosti in samozavesti,</li>
            <li>• poznavanje tveganj in strategij za obvladovanje pritiskov,</li>
            <li>• povezovanje z odraslimi in vrstniškimi modeli pozitivnih vedenj,</li>
            <li>• aktivno oblikovanje alternativnih načinov preživljanja prostega časa.</li>
          </ul>
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Poročilo Svetovne zdravstvene organizacije (WHO, 2021) opozarja, da je uspešnost programov največja, kadar so <b>interaktivni, dolgotrajni in vključujejo vrstniško dinamiko</b>, ne le enkratne informacije. Poleg tega je pomembno vključevanje družin in šolskega okolja v celosten pristop.
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          Danes ni mogoče govoriti o preventivi brez naslavljanja <b>digitalnih vedenjskih zasvojenosti</b>, ki so postale vse bolj razširjene. Mladostniki v povprečju preživijo več kot <b>6 ur dnevno na zaslonih</b>, kar vpliva na njihovo spanje, duševno zdravje, koncentracijo in odnose (Twenge idr., 2019). Preventivni programi morajo torej mladim omogočiti <b>razumevanje mehanizmov zasvojenosti</b> (dopaminska zanka, nagrajevanje, algoritmi) ter razvijati digitalne kompetence za zdravo uporabo tehnologije.
        </p>
        <h4 className="text-xl font-bold text-gray-900">Viri:</h4>
        <ul className="space-y-2 text-gray-700">
          <li>
            • ESPAD (2020). <em>European School Survey Project on Alcohol and Other Drugs.</em> <br/> <a href="https://www.espad.org" target="_blank" rel="norefferer">https://www.espad.org</a> 
          </li>
          <li>
            • Twenge, J. M. in Campbell, W. K. (2019). <em>Media Use and Mental Health in Adolescents: A Review.</em> Current Opinion in Psychology, 9, 9–14.
          </li>
          <li>
            • WHO (2021). <em>Global status report on preventing violence and substance use.</em> <br/> <a href="https://www.who.int/publications/i/item/9789240021818" target="_blank" rel="norefferer">https://www.who.int/publications/i/item/9789240021818</a> 
          </li>
        </ul>
      </div>
    ),
  },
];

