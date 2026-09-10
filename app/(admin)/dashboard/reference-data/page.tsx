import { DeleteButton } from "@/components/admin/delete-button";
import {
  deleteReferenceAction,
  saveReferenceAction,
  type ReferenceKind,
} from "@/server/actions/reference-data";
import { referenceDataService } from "@/server/services/reference-data.service";

export const dynamic = "force-dynamic";

type Item = { id: string; name?: string; value: number };

function ReferenceGroup({
  title,
  kind,
  items,
  nameLabel,
  valueLabel,
  valueName,
  step = "0.1",
  max,
}: {
  title: string;
  kind: ReferenceKind;
  items: Item[];
  nameLabel?: string;
  valueLabel: string;
  valueName: string;
  step?: string;
  max?: number;
}) {
  return (
    <section className="border bg-paper">
      <div className="border-b p-5">
        <h2 className="font-serif text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-ink-soft">{items.length} qeyd</p>
      </div>
      <div>
        {items.map((item) => (
          <form
            action={saveReferenceAction.bind(null, kind, item.id)}
            className={`grid gap-3 border-b p-4 ${nameLabel ? "md:grid-cols-[1fr_160px_auto]" : "md:grid-cols-[1fr_auto]"} md:items-end`}
            key={item.id}
          >
            {nameLabel ? (
              <label className="text-xs font-semibold">
                {nameLabel}
                <input
                  className="mt-1 h-10 w-full border bg-white px-3 text-sm font-normal"
                  defaultValue={item.name}
                  name="name"
                  required
                />
              </label>
            ) : null}
            <label className="text-xs font-semibold">
              {valueLabel}
              <input
                className="mt-1 h-10 w-full border bg-white px-3 text-sm font-normal"
                defaultValue={item.value}
                max={max}
                min={step === "1" ? 1 : 0.01}
                name={valueName}
                required
                step={step}
                type="number"
              />
            </label>
            <div className="flex h-10 items-center gap-4">
              <button
                className="text-sm font-semibold hover:underline"
                type="submit"
              >
                Saxla
              </button>
              <DeleteButton
                action={deleteReferenceAction.bind(null, kind, item.id)}
              />
            </div>
          </form>
        ))}
      </div>
      <form
        action={saveReferenceAction.bind(null, kind, "")}
        className={`grid gap-3 bg-paper-dim p-4 ${nameLabel ? "md:grid-cols-[1fr_160px_auto]" : "md:grid-cols-[1fr_auto]"} md:items-end`}
      >
        {nameLabel ? (
          <label className="text-xs font-semibold">
            {nameLabel}
            <input
              className="mt-1 h-10 w-full border bg-white px-3 text-sm font-normal"
              name="name"
              placeholder="Yeni qeyd"
              required
            />
          </label>
        ) : null}
        <label className="text-xs font-semibold">
          {valueLabel}
          <input
            className="mt-1 h-10 w-full border bg-white px-3 text-sm font-normal"
            max={max}
            min={step === "1" ? 1 : 0.01}
            name={valueName}
            required
            step={step}
            type="number"
          />
        </label>
        <button
          className="h-10 bg-ink px-4 text-sm font-semibold text-paper"
          type="submit"
        >
          Əlavə et
        </button>
      </form>
    </section>
  );
}

export default async function ReferenceDataPage() {
  const [regions, panels, batteries, roofs] = await Promise.all([
    referenceDataService.listRegions(),
    referenceDataService.listPanels(),
    referenceDataService.listBatteries(),
    referenceDataService.listRoofs(),
  ]);
  return (
    <>
      <p className="text-sm uppercase tracking-[.2em] text-copper">
        Hesablayıcı parametrləri
      </p>
      <h1 className="mt-2 font-serif text-5xl">İstinad məlumatları</h1>
      <div className="mt-10 grid gap-6 xl:grid-cols-2">
        <ReferenceGroup
          items={regions.map((item) => ({
            id: item.id,
            name: item.name,
            value: item.peakSunHours,
          }))}
          kind="region"
          nameLabel="Region"
          title="Regionlar"
          valueLabel="Pik günəş saatı"
          valueName="peakSunHours"
        />
        <ReferenceGroup
          items={panels.map((item) => ({ id: item.id, value: item.watts }))}
          kind="panel"
          step="1"
          title="Panel gücləri"
          valueLabel="Vatt"
          valueName="watts"
        />
        <ReferenceGroup
          items={batteries.map((item) => ({
            id: item.id,
            name: item.name,
            value: item.dod,
          }))}
          kind="battery"
          max={1}
          nameLabel="Batareya növü"
          title="Batareyalar"
          valueLabel="Boşalma dərinliyi"
          valueName="dod"
        />
        <ReferenceGroup
          items={roofs.map((item) => ({
            id: item.id,
            name: item.name,
            value: item.factor,
          }))}
          kind="roof"
          max={1}
          nameLabel="İstiqamət"
          title="Dam istiqamətləri"
          valueLabel="Əmsal"
          valueName="factor"
        />
      </div>
    </>
  );
}
