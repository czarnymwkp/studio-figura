import { DeviceCard } from "@/components/admin/DeviceCard"

const BASE = "https://studiofigura.rzeszow.pl/wp-content/uploads"

const DEVICES = [
  { name: "Laser Diamond Remover 1600W", description: "Urządzenie do depilacji laserowej.", image: `${BASE}/2024/05/diamond-model-300x200.jpg` },
  { name: "Hifu 4D", description: "HIFU 4D wytwarza bezpieczną falę ultradźwiękową.", image: `${BASE}/2024/05/hifu-4d-300x200.jpg` },
  { name: "Ice Tech", description: "Kriolipoliza Ice Tech polega na uzyskaniu niskiej temperatury.", image: `${BASE}/2024/05/ice-tech-300x200.jpg` },
  { name: "Laser frakcyjny", description: "Laser frakcyjny działa na zmiany skórne punktowo.", image: `${BASE}/2024/05/laser_frakcyjny_model-300x200.jpg` },
  { name: "Multipolar RF", description: "Multipolarne fale radiowe modelujące sylwetkę.", image: `${BASE}/2024/05/multipolar-rf-300x200.jpg` },
  { name: "Cavi Smart", description: "Odchudzający zabieg liposukcji kawitacyjnej.", image: `${BASE}/2024/05/cavismart-300x200.jpg` },
  { name: "Carbon Master", description: "Laser emitujący wiązkę światła o dużej energii.", image: `${BASE}/2024/05/carbon-master-300x200.jpg` },
  { name: "Analizator Body Weight", description: "Dokładne i bezpieczne pomiary składu ciała.", image: `${BASE}/2024/05/analizator-body-weight-300x200.jpg` },
  { name: "Roll Shaper", description: "Gwarancja intensywnego i relaksacyjnego masażu.", image: `${BASE}/2024/05/ROLLSHAPER-300x200.jpg` },
  { name: "Swan Shaper", description: "Urządzenie do kompleksowego modelowania sylwetki.", image: `${BASE}/2015/05/SWAN-400x267.jpg` },
  { name: "Vacu Shaper", description: "Urządzenie łączące zalety wysiłku fizycznego i działania podciśnienia.", image: `${BASE}/2015/05/1-7-400x262.jpg` },
  { name: "Limfodrenaż", description: "Specjalistyczny masaż skóry i naskórka, który pobudza wytwarzanie płynów.", image: `${BASE}/2015/05/LIMFO-400x267.jpg` },
  { name: "Elektrostymulacja", description: "Prąd o niskiej częstotliwości wywołujący skurcz odpowiednich mięśni.", image: `${BASE}/2015/05/elektro-400x267.jpg` },
  { name: "Sauna", description: "Do ogrzewania ciała wykorzystywane są bezpośrednio promienie podczerwone.", image: `${BASE}/2015/05/sauna1-400x267.jpg` },
  { name: "Rower Poziomy", description: "Przeznaczony dla osób, które chcą odciążyć odcinek lędźwiowy.", image: `${BASE}/2024/05/rower-600x400-1-300x200.jpg` },
  { name: "Platforma Wibracyjna", description: "10-15 minut ćwiczeń zastępuje kilka godzin na siłowni.", image: `${BASE}/2015/05/PLATFORMA-400x267.jpg` },
  { name: "Beauty Shaper", description: "Rewolucja w modelowaniu problematycznych części ciała.", image: `${BASE}/2015/05/BEAUTY-600x400.jpg` },
  { name: "Lipolaser", description: "Efekt odsysania tłuszczu bez zabiegu chirurgicznego.", image: `${BASE}/2015/05/IMG_5254-600x400.jpg` },
]

export default function UrzadzeniaPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Urządzenia</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {DEVICES.map((device) => (
          <DeviceCard key={device.name} name={device.name} description={device.description} image={device.image} />
        ))}
      </div>
    </div>
  )
}
