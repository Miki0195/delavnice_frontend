const ReferencesSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div
            className="relative py-6 px-8"
            style={{
              backgroundImage: 'url(/path-to-header-image.jpg)', // TODO: Add header image
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#e2e8f0', // Fallback
            }}
          >
            <div className="absolute inset-0 bg-white/80" />
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Viri:</h3>

            <ul className="space-y-4 text-gray-700">
              <li>
                • Botvin, G. J., & Griffin, K. W. (2015). Life Skills Training: A
                competence enhancement approach to tobacco, alcohol, and drug abuse
                prevention. In H. Miller (Ed.), <em>Principles of Addiction</em> (pp.
                551–560). Academic Press.
              </li>
              <li>
                • Durlak, J. A., & DuPre, E. P. (2008). Implementation matters: A review
                of research on the influence of implementation on program outcomes and
                the factors affecting implementation.{' '}
                <em>American Journal of Community Psychology</em>, 41(3-4), 327–350.
              </li>
              <li>
                • Hawkins, J. D., & Catalano, R. F. (1992).{' '}
                <em>Communities That Care: Action for Drug Abuse Prevention</em>.
                Jossey-Bass.
              </li>
              <li>
                • Nation, M., Crusto, C., Wandersman, A., Kumpfer, K. L., Seybolt, D.,
                Morrissey-Kane, E., & Davino, K. (2003). What works in prevention:
                Principles of effective prevention programs.{' '}
                <em>American Psychologist</em>, 58(6-7), 449–456.
              </li>
              <li>
                • National Research Council & Institute of Medicine. (2009).{' '}
                <em>
                  Preventing Mental, Emotional, and Behavioral Disorders Among Young
                  People: Progress and Possibilities
                </em>
                . The National Academies Press.
              </li>
              <li>
                • United Nations Office on Drugs and Crime. (2018).{' '}
                <em>International Standards on Drug Use Prevention</em>. UNODC.
              </li>
              <li>
                • World Health Organization. (2020). Adolescent health. WHO.{' '}
                <a
                  href="https://www.who.int/health-topics/adolescent-health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://www.who.int/health-topics/adolescent-health
                </a>
              </li>
              <li>
                • Košir, M. (2025).{' '}
                <em>
                  Prevention gone wrong: the do's, don'ts, and the common-sense lessons
                  in drug prevention for children and youth
                </em>
                . Institute for Research and Development „Utrip".
              </li>
              <li>
                • Roberts, G. (2017).{' '}
                <em>
                  Education sector responses to the use of alcohol, tobacco and drugs
                </em>{' '}
                (Vol. 10). UNESCO Publishing.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferencesSection;

