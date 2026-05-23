export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const passEnviada = searchParams.get('p');

  // Si nos envían una contraseña por la URL, la validamos
  if (passEnviada) {
    const passReal = await context.env.KV_DATA.get("OLEYAJI/ADMIN_PASS");
    if (passEnviada === passReal) {
      return new Response("OK", { status: 200 });
    } else {
      return new Response("ERROR", { status: 401 });
    }
  }

  // Si no hay contraseña, seguimos devolviendo la fecha como hasta ahora
  const fecha = await context.env.KV_DATA.get("OLEYAJI/DATA_CADUCITAT");
  return new Response(fecha || "2026-01-01");
}

