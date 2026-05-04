import { prisma } from "@/lib/prisma";
import { apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { attendanceSchema } from "@/lib/validations/api";

export async function GET(request: Request) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    const url = new URL(request.url);
    const childId = url.searchParams.get("childId") ?? undefined;
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    const attendance = await prisma.attendance.findMany({
      where: {
        ...(childId ? { childId } : {}),
        ...(session.role === "PARENT" ? { child: { parentId: session.userId } } : {}),
        ...(from || to
          ? {
              date: {
                ...(from ? { gte: new Date(from) } : {}),
                ...(to ? { lte: new Date(to) } : {}),
              },
            }
          : {}),
      },
      include: { child: true },
      orderBy: { date: "desc" },
    });

    return apiResponse(attendance);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  return upsertAttendance(request);
}

export async function PATCH(request: Request) {
  return upsertAttendance(request);
}

async function upsertAttendance(request: Request) {
  try {
    const session = await requireSession(["ADMIN", "SUPER_ADMIN", "STAFF"]);
    const data = await parseJson(request, attendanceSchema);
    const attendance = await prisma.attendance.upsert({
      where: { childId_date: { childId: data.childId, date: data.date } },
      update: { status: data.status, notes: data.notes, markedBy: session.clerkId },
      create: { ...data, markedBy: session.clerkId },
    });

    return apiResponse(attendance);
  } catch (error) {
    return handleRouteError(error);
  }
}
