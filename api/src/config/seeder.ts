import { MongoUserModel } from '../modules/user/infrastructure/persistence/MongoUserModel.js';
import { MongoUserProfileModel } from '../modules/user/infrastructure/persistence/MongoUserProfileModel.js';
import { MongoStoryTemplateModel } from '../modules/stories/infrastructure/persistence/MongoStoryTemplateModel.js';
import bcrypt from 'bcryptjs';

const DEFAULT_USER = {
  username: 'viajero',
  email: 'viajero@tuhistoria.app',
  password: '123456',
  role: 'user' as const,
};

const ADMIN_USER = {
  username: 'admin',
  email: 'admin@tuhistoria.app',
  password: '123456',
  role: 'admin' as const,
};

const DEFAULT_TEMPLATES = [
  {
    title: 'La última noche del Titanic',
    description: 'Estamos a bordo del Titanic en su viaje inaugural. La noche del 14 de abril de 1912, algo está a punto de ocurrir...',
    initialText: 'La noche es fría y el océano está en calma... Estás en la cubierta del barco. ¿Qué haces?',
    imageUrl: '/images/titanic.png',
  },
  {
    title: 'La isla de la Medusa',
    description: 'Una expedición en busca de la mítica isla donde habita la Medusa. Entre niebla y leyendas, nada es lo que parece.',
    initialText: 'La niebla hace que pierdas de vista a tus compañeros. Oyes voces lejanas, pero no reconoces la dirección. ¿Qué haces?',
    imageUrl: '/images/medusa.png',
  },
  {
    title: 'Hiroshima, 8:15',
    description: '6 de agosto de 1945. Una mañana como cualquier otra en Hiroshima se convierte en el infierno. Sobrevive entre las ruinas.',
    initialText: 'Es el 6 de agosto de 1945, 8:14 de la mañana en Hiroshima. De pronto un destello blanco y azul te ciega. El suelo desaparece. Minutos después despiertas rodeado de ruinas y un calor asfixiante. Gritos de pánico y dolor. Un niño llora atrapado entre escombros. ¿Qué haces?',
    imageUrl: '/images/hiroshima.png',
  },
];

export async function seed(): Promise<void> {
  for (const tpl of DEFAULT_TEMPLATES) {
    await MongoStoryTemplateModel.updateOne(
      { title: tpl.title },
      { $set: { imageUrl: tpl.imageUrl } }
    );
  }

  const salt = await bcrypt.genSalt(10);

  const existingUser = await MongoUserModel.findOne({ email: DEFAULT_USER.email });
  if (!existingUser) {
    const hashed = await bcrypt.hash(DEFAULT_USER.password, salt);
    const user = await MongoUserModel.create({
      username: DEFAULT_USER.username,
      email: DEFAULT_USER.email,
      password: hashed,
      role: DEFAULT_USER.role,
    });
    await MongoUserProfileModel.create({ user: user._id, bio: '', avatarUrl: '', location: '' });
  }

  const existingAdmin = await MongoUserModel.findOne({ email: ADMIN_USER.email });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(ADMIN_USER.password, salt);
    const admin = await MongoUserModel.create({
      username: ADMIN_USER.username,
      email: ADMIN_USER.email,
      password: hashed,
      role: ADMIN_USER.role,
    });
    await MongoUserProfileModel.create({ user: admin._id, bio: '', avatarUrl: '', location: '' });
  }

  for (const tpl of DEFAULT_TEMPLATES) {
    const exists = await MongoStoryTemplateModel.findOne({ title: tpl.title });
    if (!exists) {
      await MongoStoryTemplateModel.create(tpl);
    }
  }
}
