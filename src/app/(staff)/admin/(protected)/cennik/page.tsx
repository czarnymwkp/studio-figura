import { Button } from "@/components/ui/button"
import { IconPlus, IconPencil, IconTrash } from "@tabler/icons-react"

interface PriceItem {
  name: string
  duration: string
  price: string
}

interface PriceCategory {
  category: string
  items: PriceItem[]
}

const CENNIK: PriceCategory[] = [
  {
    category: "Depilacja laserowa",
    items: [
      { name: "Wąsik", duration: "15 min", price: "99 zł" },
      { name: "Pachy", duration: "15 min", price: "129 zł" },
      { name: "Bikini klasyczne", duration: "20 min", price: "149 zł" },
      { name: "Bikini głębokie", duration: "30 min", price: "199 zł" },
      { name: "Łydki", duration: "30 min", price: "199 zł" },
      { name: "Uda", duration: "30 min", price: "229 zł" },
      { name: "Nogi całe", duration: "60 min", price: "349 zł" },
    ],
  },
  {
    category: "Modelowanie sylwetki",
    items: [
      { name: "Kriolipoliza (1 aplikator)", duration: "60 min", price: "299 zł" },
      { name: "Kavitacja", duration: "45 min", price: "199 zł" },
      { name: "RF Multipolar", duration: "45 min", price: "199 zł" },
      { name: "Lipolaser", duration: "40 min", price: "179 zł" },
      { name: "Roll Shaper", duration: "30 min", price: "149 zł" },
      { name: "Vacu Shaper", duration: "30 min", price: "149 zł" },
    ],
  },
  {
    category: "Zabiegi na twarz",
    items: [
      { name: "HIFU 4D twarz", duration: "60 min", price: "499 zł" },
      { name: "Laser frakcyjny", duration: "45 min", price: "399 zł" },
      { name: "Carbon Master", duration: "45 min", price: "349 zł" },
      { name: "Elektrostymulacja twarzy", duration: "40 min", price: "179 zł" },
    ],
  },
  {
    category: "Masaże i relaks",
    items: [
      { name: "Limfodrenaż (nogi)", duration: "45 min", price: "149 zł" },
      { name: "Limfodrenaż (całe ciało)", duration: "60 min", price: "199 zł" },
      { name: "Sauna", duration: "30 min", price: "49 zł" },
    ],
  },
]

export default function CennikPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cennik</h1>
        <Button size="lg" className="text-base font-semibold px-6">
          <IconPlus size={20} />
          Dodaj pozycję
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {CENNIK.map((section) => (
          <div key={section.category} className="rounded-2xl border border-primary/40 overflow-hidden">
            <div className="bg-primary/10 px-4 py-3">
              <h2 className="font-semibold text-base">{section.category}</h2>
            </div>
            <table className="w-full table-fixed text-sm">
              <colgroup>
                <col className="w-[55%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left px-4 py-2 font-medium">Zabieg</th>
                  <th className="text-left px-4 py-2 font-medium">Czas</th>
                  <th className="text-left px-4 py-2 font-medium">Cena</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {section.items.map((item, i) => (
                  <tr
                    key={item.name}
                    className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}
                  >
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.duration}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{item.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <Button size="icon" variant="ghost" className="size-8">
                          <IconPencil size={15} />
                        </Button>
                        <Button size="icon" variant="ghost" className="size-8 text-destructive hover:text-destructive">
                          <IconTrash size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}
