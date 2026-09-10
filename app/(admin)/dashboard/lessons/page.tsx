import Link from "next/link";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteLessonAction } from "@/server/actions/editorial";
import { lessonsService } from "@/server/services/lessons.service";

export const dynamic = "force-dynamic";

export default async function LessonsAdminPage() {
  const lessons = await lessonsService.listAll();
  return (
    <>
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="text-sm uppercase tracking-[.2em] text-copper">
            Məzmun
          </p>
          <h1 className="mt-2 font-serif text-5xl">Dərslər</h1>
        </div>
        <Link
          className="bg-ink px-5 py-3 font-semibold text-paper"
          href="/dashboard/lessons/new"
        >
          Yeni dərs
        </Link>
      </div>
      <div className="mt-10 overflow-hidden border bg-paper">
        {lessons.length ? (
          lessons.map((lesson) => (
            <div
              className="grid gap-3 border-b p-4 last:border-0 md:grid-cols-[70px_1fr_100px_120px] md:items-center"
              key={lesson.id}
            >
              <span className="font-serif text-2xl text-amber-dim">
                {String(lesson.number).padStart(2, "0")}
              </span>
              <div>
                <strong>{lesson.title}</strong>
                <span className="mt-1 block text-sm text-ink-soft">
                  /{lesson.slug}
                </span>
              </div>
              <span
                className={
                  lesson.published ? "text-sm text-teal" : "text-sm text-copper"
                }
              >
                {lesson.published ? "Nəşrdə" : "Qaralama"}
              </span>
              <div className="flex gap-4">
                <Link
                  className="text-sm font-semibold hover:underline"
                  href={`/dashboard/lessons/${lesson.id}/edit`}
                >
                  Redaktə
                </Link>
                <form>
                  <DeleteButton
                    action={deleteLessonAction.bind(null, lesson.id)}
                  />
                </form>
              </div>
            </div>
          ))
        ) : (
          <p className="p-8 text-ink-soft">Hələ dərs yoxdur.</p>
        )}
      </div>
    </>
  );
}
