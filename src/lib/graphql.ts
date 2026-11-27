type GraphQLError = {
  message: string;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};

export const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT;

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  if (!GRAPHQL_ENDPOINT) {
    throw new Error("Falta VITE_GRAPHQL_ENDPOINT. Configúrala en el build de producción.");
  }

  // 1. Creamos un AbortController con un timeout de 60 segundos (60000 ms)
  // porque crear una base de datos dedicada en el backend toma su tiempo.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal, // <- Vinculamos la señal de timeout
    });

    clearTimeout(timeoutId); // Limpiamos el timeout si el servidor responde a tiempo

    // Intentamos parsear la respuesta de forma segura
    const payload = (await response.json().catch(() => null)) as GraphQLResponse<T> | null;

    if (!response.ok) {
      // Si el servidor da un 504 o similar pero sabemos que a veces la DB se crea igual, 
      // puedes personalizar el mensaje aquí si lo deseas.
      throw new Error(`Error en el servidor (${response.status}): No se pudo completar la solicitud.`);
    }

    if (payload?.errors?.length) {
      throw new Error(payload.errors[0].message || "No se pudo completar el registro.");
    }

    if (!payload?.data) {
      throw new Error("El servidor no devolvió una respuesta válida.");
    }

    return payload.data;

  } catch (error: any) {
    clearTimeout(timeoutId);

    // Si el error fue causado por el timeout de 60 segundos
    if (error.name === "AbortError") {
      throw new Error("La creación de la base de datos está tardando más de lo normal. Es posible que el proceso se haya completado en segundo plano; intenta iniciar sesión en unos momentos.");
    }

    // Propagamos cualquier otro error existente
    throw error;
  }
}