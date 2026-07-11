import type { Connection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import type { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import type { Category } from '../../domain/entities/Category';

// Tipo auxiliar para las filas que retorna MySQL
interface CategoryRow extends RowDataPacket {
  id: number;
  nombre: string;
  descripcion: string;
  created_at?: Date;
}

export class MySQLCategoryRepository implements ICategoryRepository {
  // Conexión inyectada desde app.ts
  constructor(private readonly connection: Connection) {}

  // ─── Retorna todas las categorías ordenadas por nombre ──────────────────────
  async findAll(): Promise<Category[]> {
    try {
      const [filas] = await this.connection.execute<CategoryRow[]>(`
        SELECT id, nombre, descripcion, created_at
        FROM categorias
        ORDER BY nombre ASC
      `);
      return filas.map((fila) => ({ ...fila }));
    } catch (error) {
      console.error('MySQLCategoryRepository.findAll falló:', error);
      throw error;
    }
  }

  // ─── Busca una categoría por ID, retorna null si no existe ──────────────────
  async findById(id: number): Promise<Category | null> {
    try {
      const [filas] = await this.connection.execute<CategoryRow[]>(
        `SELECT id, nombre, descripcion, created_at
         FROM categorias
         WHERE id = ?`,
        [id]
      );
      if (filas.length === 0) return null;
      return { ...filas[0] };
    } catch (error) {
      console.error(`MySQLCategoryRepository.findById (id=${id}) falló:`, error);
      throw error;
    }
  }

  // ─── Crea una categoría y retorna la entidad con el ID generado ─────────────
  async create(categoria: Category): Promise<Category> {
    try {
      const [resultado] = await this.connection.execute<ResultSetHeader>(
        `INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)`,
        [categoria.nombre, categoria.descripcion]
      );

      // Recuperamos la categoría completa con el ID generado
      const categoriaCreada = await this.findById(resultado.insertId);
      if (!categoriaCreada) {
        throw new Error('No se pudo recuperar la categoría recién creada');
      }
      return categoriaCreada;
    } catch (error) {
      console.error('MySQLCategoryRepository.create falló:', error);
      throw error;
    }
  }
}