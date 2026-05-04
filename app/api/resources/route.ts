import { prisma } from "@/lib/prisma";
import { apiResponse, handleRouteError, parseJson, requireSession } from "@/lib/server/api";
import { resourceCreateSchema } from "@/lib/validations/api";

export async function GET(request: Request) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    const url = new URL(request.url);
    const category = url.searchParams.get("category") ?? undefined;
    const resources = await prisma.resource.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(session.role === "PARENT" ? { visibility: { in: ["parents", "public"] } } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return apiResponse(resources);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession(["PARENT", "ADMIN", "SUPER_ADMIN", "STAFF"]);
    const data = await parseJson(request, resourceCreateSchema);
    if (session.role === "PARENT" && (data.category !== "Payment Proofs" || data.visibility !== "admin")) {
      throw new Response("Parents can only upload payment proofs", { status: 403 });
    }

    const resource = await prisma.resource.create({ data: { ...data, uploadedBy: session.clerkId } });

    return apiResponse(resource, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
