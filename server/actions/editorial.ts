"use server";

import type { FieldInputTypes, FieldOutputTypes } from "@/prisma/contract.d";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireSession } from "@/lib/auth/require-session";
import type { ActionResult } from "@/types/api";
import { lessonsService } from "@/server/services/lessons.service";
import { newsService } from "@/server/services/news.service";

const Slug = z
  .string()
  .trim()
  .min(1, "Slug tələb olunur")
  .max(120)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug yalnız kiçik hərflər, rəqəmlər və tire istifadə edə bilər",
  );
const Content = z
  .object({ type: z.literal("doc"), content: z.array(z.unknown()).optional() })
  .passthrough();

const LessonInput = z.object({
  title: z.string().trim().min(1, "Başlıq tələb olunur").max(180),
  slug: Slug,
  number: z.coerce.number().int().positive("Dərs nömrəsi müsbət olmalıdır"),
  category: z.string().trim().max(80).optional(),
  intro: z.string().trim().max(500).optional(),
  contentJson: z.string().min(1),
  published: z.boolean(),
});

const NewsInput = z.object({
  title: z.string().trim().min(1, "Başlıq tələb olunur").max(180),
  slug: Slug,
  excerpt: z.string().trim().max(500).optional(),
  contentJson: z.string().min(1),
  published: z.boolean(),
});

function fields(formData: FormData) {
  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    number: formData.get("number"),
    category: formData.get("category") || undefined,
    intro: formData.get("intro") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    contentJson: formData.get("contentJson"),
    published: formData.get("published") === "on",
  };
}

function parseContent(
  value: string,
): FieldInputTypes["public"]["Lesson"]["contentJson"] {
  return Content.parse(
    JSON.parse(value),
  ) as unknown as FieldInputTypes["public"]["Lesson"]["contentJson"];
}

function nowTimestamp(): NonNullable<
  FieldOutputTypes["public"]["News"]["publishedAt"]
> {
  return new Date().toISOString() as NonNullable<
    FieldOutputTypes["public"]["News"]["publishedAt"]
  >;
}

function failure(error: unknown): ActionResult {
  if (error instanceof z.ZodError)
    return {
      ok: false,
      error: {
        code: "VALIDATION",
        message: error.issues[0]?.message ?? "Məlumatları yoxlayın",
        details: error.flatten(),
      },
    };
  if (error instanceof SyntaxError)
    return {
      ok: false,
      error: { code: "CONTENT", message: "Mətn formatı düzgün deyil" },
    };
  if (
    typeof error === "object" &&
    error &&
    "code" in error &&
    (error.code === "P2002" ||
      ("sqlState" in error && error.sqlState === "23505"))
  )
    return {
      ok: false,
      error: { code: "DUPLICATE", message: "Bu slug artıq istifadə olunur" },
    };
  console.error("Editorial action failed", error);
  return {
    ok: false,
    error: {
      code: "INTERNAL",
      message: "Dəyişiklik saxlanmadı. Yenidən cəhd edin.",
    },
  };
}

export async function createLessonAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();
  try {
    const input = LessonInput.parse(fields(formData));
    await lessonsService.create({
      title: input.title,
      slug: input.slug,
      number: input.number,
      category: input.category || null,
      intro: input.intro || null,
      contentJson: parseContent(input.contentJson),
      published: input.published,
    });
  } catch (error) {
    return failure(error);
  }
  revalidatePath("/dashboard/lessons");
  revalidatePath("/knowledge");
  redirect("/dashboard/lessons");
}

export async function updateLessonAction(
  id: string,
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();
  try {
    const input = LessonInput.parse(fields(formData));
    await lessonsService.update(id, {
      title: input.title,
      slug: input.slug,
      number: input.number,
      category: input.category || null,
      intro: input.intro || null,
      contentJson: parseContent(input.contentJson),
      published: input.published,
    });
  } catch (error) {
    return failure(error);
  }
  revalidatePath("/dashboard/lessons");
  revalidatePath("/knowledge");
  revalidatePath(`/knowledge/${formData.get("slug")}`);
  redirect("/dashboard/lessons");
}

export async function deleteLessonAction(
  id: string,
  _formData: FormData,
): Promise<void> {
  void _formData;
  await requireSession();
  await lessonsService.delete(id);
  revalidatePath("/dashboard/lessons");
  revalidatePath("/knowledge");
}

export async function createNewsAction(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();
  try {
    const input = NewsInput.parse(fields(formData));
    await newsService.create({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt || null,
      contentJson: parseContent(input.contentJson),
      published: input.published,
      publishedAt: input.published ? nowTimestamp() : null,
    });
  } catch (error) {
    return failure(error);
  }
  revalidatePath("/dashboard/news");
  revalidatePath("/news");
  redirect("/dashboard/news");
}

export async function updateNewsAction(
  id: string,
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireSession();
  try {
    const input = NewsInput.parse(fields(formData));
    const current = await newsService.findById(id);
    if (!current)
      return {
        ok: false,
        error: { code: "NOT_FOUND", message: "Xəbər tapılmadı" },
      };
    await newsService.update(id, {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt || null,
      contentJson: parseContent(input.contentJson),
      published: input.published,
      publishedAt: input.published
        ? (current.publishedAt ?? nowTimestamp())
        : null,
    });
  } catch (error) {
    return failure(error);
  }
  revalidatePath("/dashboard/news");
  revalidatePath("/news");
  revalidatePath(`/news/${formData.get("slug")}`);
  redirect("/dashboard/news");
}

export async function deleteNewsAction(
  id: string,
  _formData: FormData,
): Promise<void> {
  void _formData;
  await requireSession();
  await newsService.delete(id);
  revalidatePath("/dashboard/news");
  revalidatePath("/news");
}
