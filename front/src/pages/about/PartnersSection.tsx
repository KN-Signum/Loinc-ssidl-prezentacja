import { Card } from "../../components/ui/card";

export function PartnersSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <Card className="border-slate-200 bg-white shadow-sm">
        <div className="space-y-4 p-6">
          <h3 className="text-lg font-semibold text-slate-900">KN Signum</h3>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <img
              src="/signum-ob.png"
              alt="Logo KN Signum"
              className="h-40 w-full rounded-md object-contain bg-white"
            />
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            Jestesmy kolem naukowym dzialajacym na Wydziale Podstawowych Problemow
            Techniki Politechniki Wroclawskiej. Powstalismy w 2023 roku z inicjatywy
            studentow inzynierii biomedycznej, ktorzy lacza nauke z praktyka i realizuja
            projekty o realnym wplywie na jakosc opieki zdrowotnej.
          </p>
          <a
            href="https://www.knsignum.pl/pl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-medium text-slate-500 underline-offset-4 transition-colors hover:text-slate-600 hover:underline"
          >
            Dowiedz sie wiecej
          </a>
        </div>
      </Card>

      <Card className="border-slate-200 bg-white shadow-sm">
        <div className="space-y-4 p-6">
          <h3 className="text-lg font-semibold text-slate-900">HL7 Poland</h3>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <img
              src="/hl7polska.png"
              alt="Logo HL7 Poland"
              className="h-40 w-full rounded-md object-contain bg-white"
            />
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            Polskie Stowarzyszenie HL7 (HL7 Poland) dziala od 2017 roku jako oficjalna
            organizacja krajowa HL7, afiliowana przy HL7 International. Organizacja skupia
            srodowiska medyczne, technologiczne i administracyjne, rozwijajac standardy
            interoperacyjnosci w ochronie zdrowia.
          </p>
          <a
            href="https://hl7.org.pl/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-medium text-slate-500 underline-offset-4 transition-colors hover:text-slate-600 hover:underline"
          >
            Dowiedz sie wiecej
          </a>
        </div>
      </Card>
    </section>
  );
}
