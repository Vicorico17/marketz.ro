import type { Metadata } from 'next';
import { ArticleShell } from '@/components/ArticleShell';
import { getPetitionConfig } from '@/lib/petitionConfig';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Datele susținătorilor' };
export default function PrivacyPage() {
  const config = getPetitionConfig();
  return <ArticleShell eyebrow="Informare privind datele personale · v1" title="Susținerea ta. Datele tale." intro="Folosim datele strict pentru petiție, mesajul de mulțumire și gestionarea drepturilor tale.">
    <section className="space-y-5 rounded-xl border border-zinc-800 p-6 text-sm leading-7 text-zinc-300">
      <h2 className="text-xl font-semibold">Organizator și contact</h2><p>Organizator: {config.organizer}. {config.contact ? <a href={`mailto:${config.contact}`} className="text-emerald-300 underline">{config.contact}</a> : 'Adresa publică de contact urmează să fie configurată; colectarea este inactivă.'}</p>
      <h2 className="text-xl font-semibold">Ce colectăm și de ce</h2><p>Numele și emailul, momentul acordului, versiunea petiției și a informării, starea trimiterii mesajului de mulțumire și coduri de securitate stocate sub formă de hash. Nu colectăm CNP, acte, domiciliu sau date din contul demo prin acest formular.</p>
      <p>Temei propus: consimțământul, art. 6 alin. (1) lit. (a) RGPD; acord explicit conform art. 9 alin. (2) lit. (a) pentru opinia exprimată, în măsura în care constituie date sensibile. Poți refuza și poți folosi simulatorul în continuare.</p>
      <h2 className="text-xl font-semibold">Cine primește datele</h2><p>Organizatorul și furnizorii săi de găzduire și bază de date; Resend primește emailul și mesajul de mulțumire, inclusiv numele declarat. Nu vindem date și nu înscriem susținători la marketing. Numele susținătorilor înregistrați poate fi transmis autorităților indicate în petiție pentru documentarea sprijinului. Emailul nu este inclus în lista publică sau în mod implicit în lista destinată autorităților.</p>
      <p>Înainte de activare, organizatorul trebuie să completeze identitatea juridică, furnizorii de găzduire/bază de date, locațiile și garanțiile pentru eventualele transferuri în afara SEE, inclusiv contractele cu persoanele împuternicite. Această informare este un proiect până la completarea acestor detalii.</p>
      <h2 className="text-xl font-semibold">Cât păstrăm datele</h2><p>Susținerile expiră după 180 de zile de la înregistrare. Nu verificăm deținerea adresei de email sau identitatea civilă; susținerile sunt declarații ale persoanelor care completează formularul. Ștergerea automată din baza de date poate avea un scurt decalaj tehnic. Copiile de siguranță și jurnalele furnizorilor trebuie să respecte o politică de retenție documentată înainte de lansare.</p>
      <h2 className="text-xl font-semibold">Retragere și drepturi</h2><p>Linkul de retragere din email șterge înregistrarea din aplicație. Retragerea nu afectează legalitatea prelucrării anterioare. Poți solicita acces, rectificare, ștergere, restricționare și portabilitate, când sunt aplicabile, prin contactul organizatorului. Datele deja transmise autorităților pot urma obligațiile lor de păstrare. Poți depune o plângere la ANSPDCP.</p>
      <h2 className="text-xl font-semibold">Susținere publică și depunere oficială</h2><p>Formularul înregistrează sprijin pentru campanie. La depunerea unei petiții în nume propriu, autoritatea poate cere și adresă de corespondență sau alte elemente de identificare. Organizatorul va verifica cerințele destinatarului; nu presupunem că acest formular înlocuiește toate formalitățile.</p>
    </section>
  </ArticleShell>;
}
