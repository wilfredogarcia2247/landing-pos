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

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = (await response.json().catch(() => null)) as GraphQLResponse<T> | null;

  if (!response.ok) {
    throw new Error("No se pudo conectar con el servidor. Inténtalo de nuevo.");
  }

  if (payload?.errors?.length) {
    throw new Error(payload.errors[0].message || "No se pudo completar el registro.");
  }

  if (!payload?.data) {
    throw new Error("El servidor no devolvió una respuesta válida.");
  }

  return payload.data;
}
