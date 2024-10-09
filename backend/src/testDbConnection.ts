import { AppDataSource } from "./index";
import { Category } from "./entity/Category";
import { Subforum } from "./entity/Subforum";
import { Thread } from "./entity/Thread";
import { Post } from "./entity/Post";
import { User } from "./entity/User";

async function testConnection() {
  try {
    await AppDataSource.initialize();
    console.log('Successfully connected to the database');

    const categoryRepository = AppDataSource.getRepository(Category);
    const categories = await categoryRepository.find({ relations: ['subforums'] });
    console.log('Categories:', categories);

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error:', error);
  }
}

testConnection();