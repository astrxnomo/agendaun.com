import { AppwriteException } from "node-appwrite"

export function handleError(error: unknown): never {
  console.error("Error:", error)

  if (error instanceof AppwriteException) {
    // Mapeo simple de errores comunes
    const userFriendlyMessages: Record<string, string> = {
      // Errores de autenticación
      user_invalid_credentials: "Email o contraseña incorrectos",
      user_not_found: "Usuario no encontrado",
      user_already_exists: "Este email ya está registrado",
      user_email_not_whitelisted: "Email no autorizado para registrarse",
      user_password_mismatch: "Las contraseñas no coinciden",
      user_session_missing: "Sesión expirada, inicia sesión nuevamente",
      user_unauthorized: "No tienes autorización para esta acción",

      // Errores de datos
      row_not_found: "Información no encontrada",
      document_not_found: "Documento no encontrado",
      collection_not_found: "Colección no encontrada",
      database_not_found: "Base de datos no encontrada",
      attribute_not_found: "Atributo no encontrado",

      // Errores generales
      general_unauthorized_scope: "Sin permisos para esta acción",
      general_rate_limit_exceeded: "Demasiadas solicitudes, espera un momento",
      general_server_error: "Error del servidor, inténtalo más tarde",
      general_protocol_unsupported: "Protocolo no soportado",
      general_codes_disabled: "Códigos de verificación deshabilitados",
      general_phone_disabled: "Verificación por teléfono deshabilitada",

      // Errores de validación
      document_invalid_structure: "Estructura de documento inválida",
      document_missing_data: "Faltan datos requeridos",
      document_missing_payload: "Datos faltantes en la solicitud",
      attribute_value_invalid: "Valor de atributo inválido",
      attribute_type_invalid: "Tipo de atributo inválido",

      // Errores de archivos
      storage_file_not_found: "Archivo no encontrado",
      storage_invalid_file_size: "Tamaño de archivo inválido",
      storage_invalid_file_type: "Tipo de archivo no permitido",
      storage_bucket_not_found: "Bucket de almacenamiento no encontrado",

      // Errores de red
      general_argument_invalid: "Argumentos inválidos en la solicitud",
      general_query_limit_exceeded: "Límite de consulta excedido",
      general_query_invalid: "Consulta inválida",
      general_cursor_not_found: "Cursor de paginación no encontrado",
    }

    const message =
      userFriendlyMessages[error.type] ||
      "Error inesperado, inténtalo más tarde"
    throw new Error(message)
  }

  throw new Error("Error inesperado, inténtalo más tarde")
}
