export interface AuthFormData {
  username?: string;
  email: string;
  password: string;
  confirmPass?: string;
}

export function validateAuthForm(data: AuthFormData): string[] {
  const errors: string[] = [];

  if (data.username !== undefined) {
    if (data.username.trim().length < 3)
      errors.push('El nombre de usuario debe tener al menos 3 caracteres');
  }

  if (!data.email.includes('@') || !data.email.includes('.'))
    errors.push('Ingresa un correo electrónico válido');

  if (data.password.length < 6)
    errors.push('La contraseña debe tener al menos 6 caracteres');

  if (data.confirmPass !== undefined && data.password !== data.confirmPass)
    errors.push('Las contraseñas no coinciden');

  return errors;
}
