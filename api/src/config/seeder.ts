import { MongoUserModel } from '../modules/user/infrastructure/persistence/MongoUserModel.js';
import { MongoUserProfileModel } from '../modules/user/infrastructure/persistence/MongoUserProfileModel.js';
import bcrypt from 'bcryptjs';
import { MongoStoryTemplateModel } from '../modules/stories/infrastructure/persistence/MongoStoryTemplateModel.js';

const DEFAULT_USER = {
  username: 'viajero',
  email: 'viajero@tuhistoria.app',
  password: '123456',
  role: 'user' as const,
};

const DEFAULT_TEMPLATES = [
  {
    title: 'La última noche del Titanic',
    description: 'Estamos a bordo del Titanic en su viaje inaugural. La noche del 14 de abril de 1912, algo está a punto de ocurrir...',
    initialText: 'La noche es fría y el océano está en calma...',
    imageUrl: '',
  },
  {
    title: 'La isla de la Medusa',
    description: 'Una expedición en busca de la mítica isla donde habita la Medusa. Entre niebla y leyendas, nada es lo que parece.',
    initialText: 'El barco corta la niebla mientras el vigía grita: "¡Tierra a la vista!"...',
    imageUrl: '',
  },
];

export async function seed(): Promise<void> {
  const existing = await MongoUserModel.findOne({ email: DEFAULT_USER.email });
  if (existing) {
    console.log('Seeder: usuario por defecto ya existe');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(DEFAULT_USER.password, salt);

  const user = await MongoUserModel.create({
    username: DEFAULT_USER.username,
    email: DEFAULT_USER.email,
    password: hashedPassword,
    role: DEFAULT_USER.role,
  });

  await MongoUserProfileModel.create({
    user: user._id,
    bio: '',
    avatarUrl: '',
    location: '',
  });

  for (const tpl of DEFAULT_TEMPLATES) {
    const exists = await MongoStoryTemplateModel.findOne({ title: tpl.title });
    if (!exists) {
      await MongoStoryTemplateModel.create(tpl);
    }
  }

  console.log('Seeder: usuario por defecto y plantillas creados');
}
