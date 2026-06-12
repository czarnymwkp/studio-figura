"use client"

import { useEffect, useState } from "react"
import { IconSparkles } from "@tabler/icons-react"

import { updateEmployeeSkills, type Employee } from "@/lib/firebase/schedule"
import { usePricing } from "@/lib/hooks/usePricing"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

interface SkillsDialogProps {
  employee: Employee | null
  onClose: () => void
}

export function SkillsDialog({ employee, onClose }: SkillsDialogProps) {
  const { pricing } = usePricing()
  const [draft, setDraft] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (employee) setDraft(employee.skills)
  }, [employee])

  async function save() {
    if (!employee) return
    setSaving(true)
    await updateEmployeeSkills(employee.uid, draft)
    setSaving(false)
    onClose()
  }

  return (
    <Dialog open={employee !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconSparkles size={20} className="text-primary" />
            Umiejętności
          </DialogTitle>
          <DialogDescription>
            {employee && `${employee.name} ${employee.surname} — zaznacz zabiegi, które wykonuje.`}
          </DialogDescription>
        </DialogHeader>
        <div className="flex max-h-96 flex-col gap-4 overflow-y-auto pr-2">
          {pricing.map((cat) => (
            <div key={cat.id} className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-primary">{cat.category}</p>
              {cat.items.map((item) => (
                <label key={item.name} className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <Checkbox
                    checked={draft.includes(item.name)}
                    onCheckedChange={(checked) =>
                      setDraft((prev) =>
                        checked ? [...prev, item.name] : prev.filter((s) => s !== item.name)
                      )
                    }
                  />
                  {item.name}
                </label>
              ))}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Anuluj</Button>
          <Button disabled={saving} onClick={save}>
            {saving ? "Zapisywanie..." : "Zapisz"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
