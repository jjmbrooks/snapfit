// Validador mínimo de JSON Schema (subconjunto draft-07 que usan content/stories/*.schema.json).
// Sin dependencias para no inflar el bundle. Soporta: type, required, properties, additionalProperties,
// propertyNames, items, minItems, maxItems, minLength, maxLength, pattern, enum.
const typeOf = (v) => (Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v);

export function validate(schema, value, path = '$', errors = []) {
  if (schema.type && typeOf(value) !== schema.type) {
    errors.push(`${path}: se esperaba ${schema.type}`);
    return errors;
  }
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${path}: valor no permitido (${value})`);
  if (typeof value === 'string') {
    if (schema.minLength != null && value.length < schema.minLength) errors.push(`${path}: vacío o muy corto`);
    if (schema.maxLength != null && value.length > schema.maxLength) errors.push(`${path}: más de ${schema.maxLength} caracteres (${value.length})`);
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(`${path}: formato inválido`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems != null && value.length < schema.minItems) errors.push(`${path}: mínimo ${schema.minItems} elementos`);
    if (schema.maxItems != null && value.length > schema.maxItems) errors.push(`${path}: máximo ${schema.maxItems} elementos`);
    if (schema.items) value.forEach((v, i) => validate(schema.items, v, `${path}[${i}]`, errors));
  }
  if (typeOf(value) === 'object') {
    for (const k of schema.required || []) if (!(k in value)) errors.push(`${path}.${k}: falta`);
    for (const [k, v] of Object.entries(value)) {
      const sub = schema.properties?.[k];
      if (schema.propertyNames) validate(schema.propertyNames, k, `${path}{${k}}`, errors);
      if (sub) validate(sub, v, `${path}.${k}`, errors);
      else if (schema.additionalProperties === false) errors.push(`${path}.${k}: clave no permitida`);
      else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') validate(schema.additionalProperties, v, `${path}.${k}`, errors);
    }
  }
  return errors;
}
